import { ObjectType } from '@nestjs/graphql';
import { BasicPaginated } from 'src/common/types/basic-pagination.type';
import { CategoryType } from './category.type';

@ObjectType('PaginatedCategory')
export class PaginatedCategoryType extends BasicPaginated(CategoryType) {}
