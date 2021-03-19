import { Field, ObjectType, ID } from '@nestjs/graphql';
import { PaginatedExpenses } from 'src/expenses/types/paginated-expenses.type';

@ObjectType('SingleCategory')
export class SingleCategoryType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => PaginatedExpenses)
  expenses: PaginatedExpenses;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
