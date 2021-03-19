import { Field, InputType } from '@nestjs/graphql';
import { MinLength, IsString, MaxLength, Matches } from 'class-validator';

@InputType('CategoryInput')
export abstract class CategoryInput {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/(^[\p{L}0-9_\-.\s']*$)/u, {
    message: 'Name can not have special characters',
  })
  @Field()
  name: string;
}
