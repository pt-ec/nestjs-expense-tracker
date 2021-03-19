import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GraphqlAuthGuard } from 'src/auth/guards/gql.guard';
import { IAccessPayload } from 'src/auth/interfaces/access.payload';
import { BasicPaginationInput } from 'src/common/inputs/basic-pagination.input';
import { AlertType } from 'src/common/types/alert.type';
import { IBasicPaginated } from 'src/common/types/basic-pagination.type';
import { ICursorPaginated } from 'src/common/types/cursor-pagination.type';
import { DateTypeEnum } from 'src/expenses/enums/date-type.enum';
import { ExpensesOrderEnum } from 'src/expenses/enums/order.enum';
import { ExpensesService } from 'src/expenses/expenses.service';
import { SearchExpenseInput } from 'src/expenses/inputs/search-expense.input';
import { Expense } from 'src/expenses/repository/expense.entity';
import { PaginatedExpenses } from 'src/expenses/types/paginated-expenses.type';
import { CategoriesService } from './categories.service';
import { CategoryInput } from './inputs/category.input';
import { Category } from './repository/category.entity';
import { CategoryType } from './types/category.type';
import { PaginatedCategoryType } from './types/paginated-category.type';
import { SingleCategoryType } from './types/single-category.type';

@Resolver(() => CategoryType)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly expensesService: ExpensesService,
  ) {}

  @Mutation(() => CategoryType)
  @UseGuards(GraphqlAuthGuard)
  public async createCategory(
    @CurrentUser() user: IAccessPayload,
    @Args('categoryInput') categoryInput: CategoryInput,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(user.id, categoryInput);
  }

  @Mutation(() => CategoryType)
  @UseGuards(GraphqlAuthGuard)
  public async updateCategory(
    @CurrentUser() user: IAccessPayload,
    @Args('search') search: string,
    @Args('categoryInput') categoryInput: CategoryInput,
  ): Promise<Category> {
    return await this.categoriesService.updateCategory(
      user.id,
      search,
      categoryInput,
    );
  }

  @Mutation(() => AlertType)
  @UseGuards(GraphqlAuthGuard)
  public async deleteCategory(
    @CurrentUser() user: IAccessPayload,
    @Args('search') search: string,
  ): Promise<AlertType> {
    return await this.categoriesService.deleteCategory(user.id, search);
  }

  @Query(() => PaginatedCategoryType)
  @UseGuards(GraphqlAuthGuard)
  public async getCategories(
    @CurrentUser() user: IAccessPayload,
    @Args('paginationInput', { defaultValue: { page: 1, pageSize: 10 } })
    pagination: BasicPaginationInput,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<IBasicPaginated<Category>> {
    return await this.categoriesService.getCategories(
      user.id,
      pagination,
      search,
    );
  }

  @Query(() => [CategoryType])
  @UseGuards(GraphqlAuthGuard)
  public async getAllCategories(
    @CurrentUser() user: IAccessPayload,
  ): Promise<Category[]> {
    return await this.categoriesService.getAllCategories(user.id);
  }

  @Query(() => SingleCategoryType)
  @UseGuards(GraphqlAuthGuard)
  public async getCategory(
    @CurrentUser() user: IAccessPayload,
    @Args('search') search: string,
  ): Promise<Category> {
    return await this.categoriesService.getCategory(user.id, search);
  }

  @ResolveField(() => PaginatedExpenses)
  public async expenses(
    @CurrentUser() user: IAccessPayload,
    @Parent() category: Category,
    @Args('searchExpensesInput', {
      defaultValue: {
        dateType: DateTypeEnum.DAY,
        first: 10,
        order: ExpensesOrderEnum.CREATED_AT_DES,
      },
    })
    searchExpensesInput: SearchExpenseInput,
  ): Promise<ICursorPaginated<Expense>> {
    return await this.expensesService.getExpenses(
      user.id,
      searchExpensesInput,
      category,
    );
  }
}
