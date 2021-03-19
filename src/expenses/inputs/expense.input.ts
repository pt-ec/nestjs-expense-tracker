import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CurrencyEnum } from '../enums/currency.enum';

@InputType('CreateExpense')
export abstract class CreateExpenseInput {
  @Field(() => ID)
  @IsUUID()
  categoryId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  amount: number;

  @Field(() => String)
  @IsString()
  @IsIn(Object.values(CurrencyEnum))
  currency: CurrencyEnum;

  @Field(() => String, { nullable: true })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description?: string;

  @Field(() => String, { defaultValue: new Date().toISOString() })
  @IsString()
  @IsDateString()
  date: string;
}
