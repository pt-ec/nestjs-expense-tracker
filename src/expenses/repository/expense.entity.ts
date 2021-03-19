import { User } from 'src/auth/repository/user.entity';
import { Category } from 'src/categories/repository/category.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { CurrencyEnum } from '../enums/currency.enum';

@Entity()
export abstract class Expense extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  amount: number; // in cents

  @Column()
  currency: CurrencyEnum;

  @Column()
  description: string;

  @Column('smallint')
  week: number;

  @Column('smallint')
  month: number;

  @Column('smallint')
  year: number;

  @Column({
    type: 'date',
    default: new Date().toDateString(),
  })
  date: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string;

  @ManyToOne(() => Category, (category) => category.expenses)
  category: Category;

  @ManyToOne(() => User, (user) => user.expenses)
  user: User;
}
