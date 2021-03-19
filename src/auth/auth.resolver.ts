import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AlertType } from 'src/common/types/alert.type';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { GraphqlAuthGuard } from './guards/gql.guard';
import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-password.input';
import { LoginInput } from './inputs/login.input';
import { RegistrationInput } from './inputs/registration.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { IAccessPayload } from './interfaces/access.payload';
import { AccessType } from './types/access.type';
import { AuthType } from './types/auth.type';

@Resolver(() => AccessType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AlertType)
  public async register(
    @Args('registrationInput')
    registrationInput: RegistrationInput,
  ): Promise<AlertType> {
    return await this.authService.registerUser(registrationInput);
  }

  @Mutation(() => AuthType)
  public async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthType> {
    return await this.authService.loginUser(loginInput);
  }

  @Mutation(() => AccessType)
  public async refreshAccessToken(
    @Args('token') token: string,
  ): Promise<AccessType> {
    return await this.authService.refreshAccessToken(token);
  }

  @Mutation(() => AuthType)
  public async confirmAccount(@Args('token') token: string): Promise<AuthType> {
    return await this.authService.confirmAccount(token);
  }

  @Mutation(() => AlertType)
  public async sendResetEmail(
    @Args('email') email: string,
  ): Promise<AlertType> {
    return await this.authService.sendResetEmail(email);
  }

  @Mutation(() => AlertType)
  public async resetPassword(
    @Args('token') token: string,
    @Args('resetTokenInput')
    resetPasswordInput: ResetPasswordInput,
  ): Promise<AlertType> {
    return await this.authService.resetPassword(token, resetPasswordInput);
  }

  @Mutation(() => AlertType)
  @UseGuards(GraphqlAuthGuard)
  public async deleteAccount(
    @CurrentUser() user: IAccessPayload,
    @Args('password') password: string,
  ): Promise<AlertType> {
    return await this.authService.deleteAccount(user.id, password);
  }

  @Mutation(() => AuthType)
  @UseGuards(GraphqlAuthGuard)
  public async changePassword(
    @CurrentUser() user: IAccessPayload,
    @Args('changePasswordInput')
    changePasswordInput: ChangePasswordInput,
  ): Promise<AuthType> {
    return await this.authService.changePassword(user.id, changePasswordInput);
  }

  @Mutation(() => AuthType)
  @UseGuards(GraphqlAuthGuard)
  public async changeEmail(
    @CurrentUser() user: IAccessPayload,
    @Args('changeEmailInput')
    changeEmailInput: ChangeEmailInput,
  ): Promise<AuthType> {
    return await this.authService.changeEmail(user.id, changeEmailInput);
  }
}
