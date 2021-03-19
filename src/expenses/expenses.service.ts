import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/repository/category.entity';
import { CommonService } from 'src/common/common.service';
import { AlertStatusEnum } from 'src/common/enums/alert-status.enum';
import { AlertType } from 'src/common/types/alert.type';
import { ICursorPaginated } from 'src/common/types/cursor-pagination.type';
import { CreateExpenseInput } from './inputs/expense.input';
import { SearchExpenseInput } from './inputs/search-expense.input';
import { UpdateExpenseInput } from './inputs/update-expense.input';
import { Expense } from './repository/expense.entity';
import { ExpenseRepository } from './repository/expense.repository';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpenseRepository)
    private readonly expenseRepository: ExpenseRepository,
    private readonly authService: AuthService,
    private readonly categoriesService: CategoriesService,
    private readonly commonService: CommonService,
  ) {}

  public async createExpense(
    id: string,
    createExpenseInput: CreateExpenseInput,
  ): Promise<Expense> {
    const user = await this.authService.getUserById(id);
    const category = await this.categoriesService.getCategory(
      id,
      createExpenseInput.categoryId,
    );
    const expense = await this.expenseRepository.createExpense(
      user,
      category,
      createExpenseInput,
    );
    return expense;
  }

  public async updateExpense(
    userId: string,
    expenseId: string,
    updateExpenseInput: UpdateExpenseInput,
  ): Promise<Expense> {
    const expense = await this.expenseRepository.getExpense(userId, expenseId);
    const { categoryHandle, ...rest } = updateExpenseInput;

    if (categoryHandle)
      expense.category = await this.categoriesService.getCategory(
        userId,
        categoryHandle,
      );

    await this.commonService.updateInstance(rest, expense);
    return expense;
  }

  public async deleteExpense(
    userId: string,
    expenseId: string,
  ): Promise<AlertType> {
    const expense = await this.expenseRepository.getExpense(userId, expenseId);
    await expense.softRemove();

    return {
      status: AlertStatusEnum.SUCCESS,
      message: `Expense with ${expenseId} deleted successfuly`,
    };
  }

  public async getSingleExpense(
    userId: string,
    expenseId: string,
  ): Promise<Expense> {
    const expense = await this.expenseRepository.getExpense(userId, expenseId);
    return expense;
  }

  public async getExpenses(
    handle: string,
    searchInput: SearchExpenseInput,
    category?: Category,
  ): Promise<ICursorPaginated<Expense>> {
    const [expenses, totalCount] = await this.expenseRepository.getExpenses(
      handle,
      searchInput,
      searchInput.after
        ? this.commonService.decodeCursor(searchInput.after)
        : undefined,
      category,
    );
    const paginatedExpenses = this.commonService.cursorPaginate(
      expenses,
      totalCount,
      'createdAt',
      searchInput.first,
    );

    return paginatedExpenses;
  }

  public async getAllExpenses(handle: string): Promise<Expense[]> {
    const expenses = await this.expenseRepository.find({
      where: {
        user: { handle },
      },
      order: {
        date: 'DESC',
      },
    });

    return expenses;
  }
}
