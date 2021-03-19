import { ObjectType } from '@nestjs/graphql';
import { CursorPaginated } from 'src/common/types/cursor-pagination.type';
import { ExpenseType } from './expense.type';

@ObjectType('PaginatedExpenses')
export class PaginatedExpenses extends CursorPaginated(ExpenseType) {}
