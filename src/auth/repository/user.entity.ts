import * as bcrypt from 'bcryptjs';
import { Category } from 'src/categories/repository/category.entity';
import { Expense } from 'src/expenses/repository/expense.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export abstract class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  picture: string;

  @Column()
  password: string;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ type: 'int', default: 0 })
  count: number;

  @Column({
    type: 'timestamp with time zone',
    default: new Date().toISOString(),
  })
  lastLogin: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
