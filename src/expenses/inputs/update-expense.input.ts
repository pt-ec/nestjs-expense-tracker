import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CurrencyEnum } from '../enums/currency.enum';

@InputType('UpdateExpense')
export abstract class UpdateExpenseInput {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  categoryHandle?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  amount?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(CurrencyEnum))
  currency?: CurrencyEnum;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description?: string;

  @Field(() => String, { defaultValue: new Date().toDateString() })
  @IsOptional()
  @IsString()
  @IsDateString()
  date?: string;
}
