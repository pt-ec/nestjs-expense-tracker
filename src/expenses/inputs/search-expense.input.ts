import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsDateString,
  IsIn,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
  IsInt,
  Min,
  Max,
  IsBase64,
} from 'class-validator';
import { DateTypeEnum } from '../enums/date-type.enum';
import { ExpensesOrderEnum } from '../enums/order.enum';

@InputType('SearchExpense')
export abstract class SearchExpenseInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsDateString()
  date?: string;

  @Field(() => String, { defaultValue: DateTypeEnum.DAY })
  @IsString()
  @IsIn(Object.values(DateTypeEnum))
  dateType: DateTypeEnum;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/(^[\p{L}0-9_\-.,!\?;:"\s']*$)/u, {
    message: 'Search field cannot have special characters',
  })
  @MinLength(1)
  @MaxLength(155)
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  amount?: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(1)
  @Max(10000)
  first: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsBase64()
  after?: string;

  @Field(() => String, { defaultValue: ExpensesOrderEnum.CREATED_AT_DES })
  @IsString()
  @IsIn(Object.values(ExpensesOrderEnum))
  order: ExpensesOrderEnum;
}
