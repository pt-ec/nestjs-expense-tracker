import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function BasicPaginated<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], { nullable: true })
    results: T[];

    @Field(() => Int)
    totalCount: number;

    @Field(() => Int)
    totalPages: number;

    @Field(() => Boolean)
    hasNextPage: boolean;
  }
  return PaginatedType;
}

export interface IBasicPaginated<T> {
  results: T[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
}
