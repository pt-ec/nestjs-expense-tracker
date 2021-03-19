import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { CommonModule } from 'src/common/common.module';
import { CategoryRepository } from './repository/category.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository]),
    CommonModule,
    AuthModule,
    forwardRef(() => ExpensesModule),
  ],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
