import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/repository/user.entity';
import { BasicPaginationInput } from 'src/common/inputs/basic-pagination.input';
import { EntityRepository, Repository } from 'typeorm';
import { CategoryInput } from '../inputs/category.input';
import { Category } from './category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  public async createCategory(
    user: User,
    categoryInput: CategoryInput,
  ): Promise<Category> {
    const category = this.create({
      name: categoryInput.name.toLowerCase(),
      user,
    });

    try {
      await category.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`${categoryInput.name} already exists`);
      }
      throw new InternalServerErrorException();
    }

    return category;
  }

  public async updateCategory(
    handle: string,
    search: string,
    name: string,
  ): Promise<Category> {
    const category = await this.getCategory(handle, search);
    category.name = name;

    try {
      await category.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`${name} already exists`);
      }
      throw new InternalServerErrorException();
    }

    return category;
  }

  public async getCategory(id: string, search: string): Promise<Category> {
    const searchTerm = search.toLowerCase();
    if (!/(^[\p{L}0-9_\-.\s']*$)/gu.test(searchTerm))
      throw new BadRequestException(
        'Search term can not have special characters',
      );

    const isUuid = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    const term = isUuid.test(searchTerm) ? 'id' : 'name';

    const category = await this.findOne({
      [term]: searchTerm,
      user: { id },
    });

    if (!category)
      throw new NotFoundException(
        `Category with ${searchTerm} ${term} not found`,
      );

    return category;
  }

  public async getCategoryById(
    userId: string,
    categoryId: string,
  ): Promise<Category> {
    const category = await this.findOne({
      id: categoryId,
      user: {
        id: userId,
      },
    });
    if (!category)
      throw new NotFoundException(`Category with ${categoryId} id not found`);

    return category;
  }

  public async queryCategories(
    id: string,
    pagination: BasicPaginationInput,
    search?: string | null,
  ): Promise<[Category[], number]> {
    const { pageSize, page } = pagination;
    const qs = this.createQueryBuilder('category')
      .orderBy('category.name', 'ASC')
      .where('(category.userId = :id)', { id });

    if (search)
      qs.andWhere('(category.name LIKE :search)', {
        search: `%${search.toLowerCase()}%`,
      });

    const query = await qs
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return query;
  }
}
