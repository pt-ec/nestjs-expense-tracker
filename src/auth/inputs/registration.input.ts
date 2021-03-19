import { Field, InputType } from '@nestjs/graphql';
import {
  MinLength,
  IsEmail,
  Matches,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType('Registration')
export abstract class RegistrationInput {
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  @Matches(/(^[A-Za-z0-9_\-]*$)/, {
    message:
      'Username can only contain letters, numbers, dashes and underscores',
  })
  @Field()
  username: string;

  @IsString()
  @IsEmail()
  @MinLength(7)
  @MaxLength(254)
  @Field()
  email: string;

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
