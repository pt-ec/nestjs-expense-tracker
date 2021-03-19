import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import { User } from 'src/auth/repository/user.entity';
import { Category } from 'src/categories/repository/category.entity';
import {
  EntityRepository,
  Repository,
  ILike,
  Between,
  MoreThan,
  LessThan,
} from 'typeorm';
import { DateTypeEnum } from '../enums/date-type.enum';
import { CreateExpenseInput } from '../inputs/expense.input';
import { SearchExpenseInput } from '../inputs/search-expense.input';
import { Expense } from './expense.entity';
dayjs.extend(isoWeek);

@EntityRepository(Expense)
export class ExpenseRepository extends Repository<Expense> {
  public async createExpense(
    user: User,
    category: Category,
    createExpenseInput: CreateExpenseInput,
  ): Promise<Expense> {
    const { amount, currency, description, date } = createExpenseInput;
    const dayjsDate = dayjs(date);
    const expense = this.create({
      amount,
      currency,
      description,
      date,
      user,
      category,
      week: dayjsDate.isoWeek(),
      month: dayjsDate.month(),
      year: dayjsDate.year(),
    });
    await expense.save();
    return expense;
  }

  public async getExpenses(
    id: string,
    searchInput: SearchExpenseInput,
    decodedAfter?: string,
    category?: Category,
  ): Promise<[Expense[], number]> {
    if (decodedAfter) {
      if (!new Date(decodedAfter).getTime() && !parseInt(decodedAfter, 10))
        throw new BadRequestException('After is not valid');
    }

    const { date, dateType, description, amount, first, order } = searchInput;
    const orderArr = order.split('_');
    const filters: Partial<Record<keyof Expense, any>> = {};

    if (date) {
      const dayjsDate = dayjs(date);
      filters.year = dayjsDate.year();
      switch (dateType) {
        case DateTypeEnum.YEAR:
          break;
        case DateTypeEnum.MONTH:
          filters.month = dayjsDate.month();
          break;
        case DateTypeEnum.WEEK:
          filters.week = dayjsDate.isoWeek();
          break;
        case DateTypeEnum.DAY:
        default:
          filters.date = dayjsDate.format('DD-MM-YYYY');
          break;
      }
    }
    if (description)
      filters.description = ILike(`%${description.toLowerCase()}%`);
    if (amount) filters.amount = Between(amount * 0.8, amount * 1.2);
    if (decodedAfter)
      filters[orderArr[0]] =
        orderArr[0] === 'createdAt'
          ? orderArr[1] === 'ASC'
            ? MoreThan(dayjs(decodedAfter).toISOString())
            : LessThan(dayjs(decodedAfter).toISOString())
          : orderArr[1] === 'ASC'
          ? MoreThan(parseInt(decodedAfter, 10))
          : LessThan(parseInt(decodedAfter, 10));
    if (category) filters.category = category;

    const qs = await this.findAndCount({
      order: {
        [orderArr[0]]: orderArr[1],
      },
      where: {
        user: { id },
        ...filters,
      },
      take: first,
    });

    return qs;
  }

  public async getExpense(userId: string, expenseId: string): Promise<Expense> {
    const expense = this.findOne({
      id: expenseId,
      user: {
        id: userId,
      },
    });
    if (!expense)
      throw new NotFoundException(`Expense with id ${expenseId} not found`);
    return expense;
  }
}
