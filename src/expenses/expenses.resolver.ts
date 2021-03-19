import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GraphqlAuthGuard } from 'src/auth/guards/gql.guard';
import { IAccessPayload } from 'src/auth/interfaces/access.payload';
import { AlertType } from 'src/common/types/alert.type';
import { ICursorPaginated } from 'src/common/types/cursor-pagination.type';
import { DateTypeEnum } from './enums/date-type.enum';
import { ExpensesOrderEnum } from './enums/order.enum';
import { ExpensesService } from './expenses.service';
import { CreateExpenseInput } from './inputs/expense.input';
import { SearchExpenseInput } from './inputs/search-expense.input';
import { UpdateExpenseInput } from './inputs/update-expense.input';
import { Expense } from './repository/expense.entity';
import { ExpenseType } from './types/expense.type';
import { PaginatedExpenses } from './types/paginated-expenses.type';

@Resolver(() => ExpenseType)
export class ExpensesResolver {
  constructor(private readonly expensesService: ExpensesService) {}

  @Mutation(() => ExpenseType)
  @UseGuards(GraphqlAuthGuard)
  public async createExpense(
    @CurrentUser() user: IAccessPayload,
    @Args('createExpenseInput') createExpenseInput: CreateExpenseInput,
  ): Promise<Expense> {
    return await this.expensesService.createExpense(
      user.id,
      createExpenseInput,
    );
  }

  @Mutation(() => ExpenseType)
  @UseGuards(GraphqlAuthGuard)
  public async updateExpense(
    @CurrentUser() user: IAccessPayload,
    @Args('id', new ParseUUIDPipe()) expendeId: string,
    @Args('updateExpenseInput') updateExpenseInput: UpdateExpenseInput,
  ): Promise<Expense> {
    return await this.expensesService.updateExpense(
      user.id,
      expendeId,
      updateExpenseInput,
    );
  }

  @Mutation(() => AlertType)
  @UseGuards(GraphqlAuthGuard)
  public async deleteExpense(
    @CurrentUser() user: IAccessPayload,
    @Args('id', new ParseUUIDPipe()) expendeId: string,
  ): Promise<AlertType> {
    return await this.expensesService.deleteExpense(user.id, expendeId);
  }

  @Query(() => PaginatedExpenses)
  @UseGuards(GraphqlAuthGuard)
  public async getExpenses(
    @CurrentUser() user: IAccessPayload,
    @Args('searchExpensesInput', {
      defaultValue: {
        dateType: DateTypeEnum.DAY,
        first: 10,
        order: ExpensesOrderEnum.CREATED_AT_DES,
      },
    })
    searchExpensesInput: SearchExpenseInput,
  ): Promise<ICursorPaginated<Expense>> {
    return await this.expensesService.getExpenses(user.id, searchExpensesInput);
  }

  @Query(() => [ExpenseType])
  @UseGuards(GraphqlAuthGuard)
  public async getAllExpenses(
    @CurrentUser() user: IAccessPayload,
  ): Promise<Expense[]> {
    return await this.expensesService.getAllExpenses(user.id);
  }

  @Query(() => ExpenseType)
  @UseGuards(GraphqlAuthGuard)
  public async getExpense(
    @CurrentUser() user: IAccessPayload,
    @Args('id', new ParseUUIDPipe()) expendeId: string,
  ): Promise<Expense> {
    return await this.expensesService.getSingleExpense(user.id, expendeId);
  }
}
