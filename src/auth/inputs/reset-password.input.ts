import { Field, InputType } from '@nestjs/graphql';
import { MinLength, Matches, IsString } from 'class-validator';

@InputType('ResetPassword')
export abstract class ResetPasswordInput {
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password requires a lowercase letter, an Uppercase letter and a number or a symbol',
  })
  @Field()
  password1: string;

  @IsString()
  @Field()
  password2: string;
}
