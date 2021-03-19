import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from './interfaces/token.payload';
import { RegistrationInput } from './inputs/registration.input';
import { LoginInput } from './inputs/login.input';
import { AuthType } from './types/auth.type';
import { AccessType } from './types/access.type';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { ChangePasswordInput } from './inputs/change-password.input';
import { ChangeEmailInput } from './inputs/change-email.input';
import { AlertType } from 'src/common/types/alert.type';
import { AlertStatusEnum } from 'src/common/enums/alert-status.enum';
import { User } from './repository/user.entity';

type TokenType = 'refresh' | 'confirmation' | 'resetPassword';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async registerUser(
    registrationInput: RegistrationInput,
  ): Promise<AlertType> {
    const user = await this.userRepository.createUser(registrationInput);

    // Generate a confirmation token
    const emailToken = await this.generateJwtToken(
      { id: user.id, count: user.count },
      'confirmation',
    );
    const baseUrl = this.configService.get<string>('url');
    const url = `${baseUrl}confirm-email/${emailToken}/`;
    this.emailService.sendConfirmationEmail(user.email, user.username, url);

    return {
      status: AlertStatusEnum.SUCCESS,
      message: 'Registration successfull. Please confirm your email.',
    };
  }

  public async loginUser(loginInput: LoginInput): Promise<AuthType> {
    const user = await this.userRepository.loginUser(loginInput);

    if (!user.confirmed) {
      // Generate a confirmation token
      const emailToken = await this.generateJwtToken(
        { id: user.id, count: user.count },
        'confirmation',
      );
      const baseUrl = this.configService.get<string>('url');
      const url = `${baseUrl}confirm-email/${emailToken}/`;
      this.emailService.sendConfirmationEmail(user.email, user.username, url);

      throw new UnauthorizedException(
        'Please confirm your email. A new email has been sent.',
      );
    }

    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user.id,
      user.count,
    );

    return { user, accessToken, refreshToken };
  }

  public async refreshAccessToken(token: string): Promise<AccessType> {
    const payload = await this.verifyJwtToken(token, 'refresh');
    const user = await this.userRepository.getUserByPayload(payload);
    const accessToken = await this.jwtService.signAsync({ id: user.id });
    return { accessToken, user };
  }

  public async confirmAccount(token: string): Promise<AuthType> {
    const payload = await this.verifyJwtToken(token, 'confirmation');
    const user = await this.userRepository.confirmAccount(payload);
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user.id,
      user.count,
    );

    return { user, accessToken, refreshToken };
  }

  public async sendResetEmail(email: string): Promise<AlertType> {
    const user = await this.userRepository.getUserByEmail(email);

    // Generate a confirmation token
    const emailToken = await this.generateJwtToken(
      { id: user.id, count: user.count },
      'resetPassword',
    );
    const baseUrl = this.configService.get<string>('url');
    const url = `${baseUrl}confirm-email/${emailToken}/`;
    await this.emailService.sendPasswordResetEmail(user, url);

    return {
      status: AlertStatusEnum.SUCCESS,
      message: 'Password reset email sent.',
    };
  }

  public async resetPassword(
    token: string,
    resetPasswordInput: ResetPasswordInput,
  ): Promise<AlertType> {
    const { id } = await this.verifyJwtToken(token, 'resetPassword');
    await this.userRepository.resetPassword(id, resetPasswordInput);

    return {
      status: AlertStatusEnum.SUCCESS,
      message: 'Password reseted successfuly',
    };
  }

  public async deleteAccount(id: string, password: string): Promise<AlertType> {
    await this.userRepository.deleteUser(id, password);
    return {
      status: AlertStatusEnum.SUCCESS,
      message: 'Accound deleted successfuly',
    };
  }

  public async changePassword(
    id: string,
    changePasswordInput: ChangePasswordInput,
  ): Promise<AuthType> {
    const user = await this.userRepository.changePassword(
      id,
      changePasswordInput,
    );
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user.id,
      user.count,
    );

    return { user, accessToken, refreshToken };
  }

  public async changeEmail(
    id: string,
    changeEmailInput: ChangeEmailInput,
  ): Promise<AuthType> {
    const user = await this.userRepository.changeEmail(id, changeEmailInput);
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user.id,
      user.count,
    );

    return { user, accessToken, refreshToken };
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.getUserById(id);
    return user;
  }

  private async generateJwtToken(
    payload: ITokenPayload,
    type: TokenType,
  ): Promise<string> {
    const secret = this.configService.get<string>(`jwt.${type}Secret`);
    const time = this.configService.get<number>(`jwt.${type}Time`);

    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { expiresIn: time }, (error, token) => {
        if (error) {
          reject(error);
        }
        resolve(token);
      });
    });
  }

  private async verifyJwtToken(
    token: string,
    type: TokenType,
  ): Promise<ITokenPayload> {
    const secret = this.configService.get<string>(`jwt.${type}Secret`);

    return new Promise((resolve) => {
      jwt.verify(
        token,
        secret,
        (error: Record<string, any>, payload: ITokenPayload) => {
          if (error) {
            if (error.name === 'TokenExpiredError') {
              throw new UnauthorizedException('Token has expired');
            } else {
              throw new UnauthorizedException(error.message);
            }
          }
          resolve(payload);
        },
      );
    });
  }

  private async generateAuthTokens(
    id: string,
    count: number,
  ): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.signAsync({ id }),
      this.generateJwtToken({ id, count }, 'refresh'),
    ]);
  }
}
