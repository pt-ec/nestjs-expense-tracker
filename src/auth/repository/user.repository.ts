import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { RegistrationInput } from '../inputs/registration.input';
import { ChangePasswordInput } from '../inputs/change-password.input';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { ChangeEmailInput } from '../inputs/change-email.input';
import { LoginInput } from '../inputs/login.input';
import { ITokenPayload } from '../interfaces/token.payload';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async createUser(registrationInput: RegistrationInput): Promise<User> {
    const { username, email, password1, password2 } = registrationInput;
    if (password1 !== password2)
      throw new BadRequestException('Passwords do not match');

    const user = this.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
    });
    user.password = await bcrypt.hash(password1, 10);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        // duplicate error code
        if (error.detail === `Key (username)=(${username}) already exists.`) {
          throw new ConflictException('Username already exists');
        }
        throw new ConflictException('Email already exists');
      }
      console.log('here');
      console.log(error);
      throw new InternalServerErrorException();
    }

    user.password = '';
    return user;
  }

  public async loginUser(loginInput: LoginInput): Promise<User> {
    let user: User;
    const { input, password } = loginInput;
    if (this.validateEmail(input)) {
      user = await this.findOne({ email: input });
    } else {
      user = await this.findOne({ username: input });
    }

    if (!user || !(await user.validatePassword(password)))
      throw new UnauthorizedException('Invalid credentials');

    user.lastLogin = new Date(Date.now());
    await user.save();

    user.password = '';
    return user;
  }

  public async changePassword(
    id: string,
    changePasswordInput: ChangePasswordInput,
  ): Promise<User> {
    const { oldPassword, password1, password2 } = changePasswordInput;
    const user = await this.findUser(id, oldPassword);

    if (password1 !== password2)
      throw new BadRequestException('Passwords do not match');

    user.password = await bcrypt.hash(password1, 10);
    user.count++;
    await user.save();

    user.password = '';
    return user;
  }

  public async resetPassword(
    id: string,
    resetPasswordInput: ResetPasswordInput,
  ): Promise<void> {
    const user = await this.findUser(id);

    const { password1, password2 } = resetPasswordInput;
    if (password1 !== password2)
      throw new BadRequestException('Passwords do not match');

    const password = await bcrypt.hash(password1, 10);
    user.password = password;
    user.count++;
    user.save();
  }

  public async changeEmail(
    id: string,
    changeEmailInput: ChangeEmailInput,
  ): Promise<User> {
    const { email, password } = changeEmailInput;
    const user = await this.findUser(id, password);

    user.email = email;
    user.count++;
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Email already exists');
      throw new InternalServerErrorException();
    }

    return user;
  }

  public async confirmAccount(payload: ITokenPayload): Promise<User> {
    const user = await this.getUserByPayload(payload);

    user.confirmed = true;
    user.count++;
    await user.save();
    return user;
  }

  public async deleteUser(id: string, password: string): Promise<void> {
    const user = await this.findUser(id, password);
    await user.softRemove();
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.findUser(id);

    return user;
  }

  public async getUserByPayload(payload: ITokenPayload): Promise<User> {
    const { id, count } = payload;
    const user = await this.findOne({ id, count });

    if (!user) throw new UnauthorizedException('Token is invalid');

    return user;
  }

  public async getUserByEmail(email: string): Promise<User> {
    if (!this.validateEmail(email))
      throw new BadRequestException('Please use a valid email');
    const user = await this.findOne({ email });
    if (!user) throw new NotFoundException('User with given email not found');
    return user;
  }

  private async findUser(id: string, password?: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    if (password !== undefined && !(await user.validatePassword(password)))
      throw new BadRequestException('Wrong password');

    return user;
  }

  private validateEmail(email: string): boolean {
    const mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return mailRegex.test(email);
  }
}
