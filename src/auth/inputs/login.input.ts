import { Field, InputType } from '@nestjs/graphql';
import { MinLength, IsString } from 'class-validator';

@InputType('Login')
export abstract class LoginInput {
  @IsString()
  @MinLength(1)
  @Field()
  input: string;

  @IsString()
  @MinLength(1)
  @Field()
  password: string;
}
