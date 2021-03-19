import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsString,
  Max,
  Min,
  IsBase64,
  IsOptional,
} from 'class-validator';

@InputType('CursorPagination')
export abstract class CursorPaginationInput {
  @IsInt()
  @Min(1)
  @Max(100)
  @Field(() => Int, { defaultValue: 10 })
  first: number;

  @IsOptional()
  @IsString()
  @IsBase64()
  @Field({ nullable: true })
  after?: string;
}
