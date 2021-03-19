import { Field, ObjectType, Int, ID } from '@nestjs/graphql';
import { CurrencyEnum } from '../enums/currency.enum';

@ObjectType('Expense')
export class ExpenseType {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  amount: number;

  @Field(() => String)
  currency: CurrencyEnum;

  @Field(() => String)
  description: string;

  @Field(() => String)
  date: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
