import { Field, InputType } from '@nestjs/graphql';
import { MinLength, Matches, IsString, MaxLength } from 'class-validator';

@InputType('ChangePassword')
export abstract class ChangePasswordInput {
  @IsString()
  @MinLength(1)
  @Field()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(35)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password requires a lowercase letter, an uppercase letter, and a number or a symbol',
  })
  @Field()
  password1: string;

  @IsString()
  @Field()
  password2: string;
}
