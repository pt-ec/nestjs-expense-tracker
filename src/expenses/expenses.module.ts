import { Module, forwardRef } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesResolver } from './expenses.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseRepository } from './repository/expense.repository';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseRepository]),
    CommonModule,
    AuthModule,
    forwardRef(() => CategoriesModule),
  ],
  providers: [ExpensesService, ExpensesResolver],
  exports: [ExpensesService],
})
export class ExpensesModule {}
