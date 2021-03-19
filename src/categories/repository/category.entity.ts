import { User } from 'src/auth/repository/user.entity';
import { Expense } from 'src/expenses/repository/expense.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['name', 'user'])
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];
}
