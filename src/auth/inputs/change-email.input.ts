import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType('ChangeEmail')
export abstract class ChangeEmailInput {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @MinLength(1)
  @Field()
  password: string;
}
