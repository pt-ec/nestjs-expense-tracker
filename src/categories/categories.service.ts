import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CommonService } from 'src/common/common.service';
import { AlertStatusEnum } from 'src/common/enums/alert-status.enum';
import { BasicPaginationInput } from 'src/common/inputs/basic-pagination.input';
import { AlertType } from 'src/common/types/alert.type';
import { IBasicPaginated } from 'src/common/types/basic-pagination.type';
import { CategoryInput } from './inputs/category.input';
import { Category } from './repository/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
    private readonly commonService: CommonService,
    private readonly authService: AuthService,
  ) {}

  public async createCategory(
    id: string,
    categoryInput: CategoryInput,
  ): Promise<Category> {
    const user = await this.authService.getUserById(id);
    const category = await this.categoryRepository.createCategory(
      user,
      categoryInput,
    );
    return category;
  }

  public async updateCategory(
    id: string,
    search: string,
    categoryInput: CategoryInput,
  ): Promise<Category> {
    const updatedCategory = await this.categoryRepository.updateCategory(
      id,
      search,
      categoryInput.name.toLowerCase(),
    );
    return updatedCategory;
  }

  public async deleteCategory(id: string, search: string): Promise<AlertType> {
    const category = await this.categoryRepository.getCategory(id, search);
    await category.softRemove();

    return {
      status: AlertStatusEnum.SUCCESS,
      message: `Category ${search} deleted successfully`,
    };
  }

  public async getCategory(id: string, search: string): Promise<Category> {
    const category = await this.categoryRepository.getCategory(id, search);
    return category;
  }

  public async getCategories(
    id: string,
    pagination: BasicPaginationInput,
    search?: string,
  ): Promise<IBasicPaginated<Category>> {
    if (search) this.commonService.validateSearchInput(search);
    const [
      categories,
      totalCount,
    ] = await this.categoryRepository.queryCategories(id, pagination, search);
    const { page, pageSize } = pagination;
    const paginatedCategories = this.commonService.basicPaginate(
      categories,
      totalCount,
      page,
      pageSize,
    );
    return paginatedCategories;
  }

  public async getAllCategories(id: string): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      user: { id },
    });
    return categories;
  }
}
