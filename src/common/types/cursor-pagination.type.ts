import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function CursorPaginated<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType(`${classRef.name}PageInfo`)
  abstract class PageInfoType {
    @Field(() => String)
    endCursor: string;

    @Field()
    hasNextPage: boolean;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => Int)
    totalCount: number;

    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => PageInfoType)
    pageInfo: PageInfoType;
  }
  return PaginatedType;
}

export interface IEdge<T> {
  cursor: string;
  node: T;
}

interface IPageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export interface ICursorPaginated<T> {
  totalCount: number;
  edges: IEdge<T>[];
  pageInfo: IPageInfo;
}
