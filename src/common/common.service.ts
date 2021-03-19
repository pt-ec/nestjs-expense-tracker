import { BadRequestException, Injectable } from '@nestjs/common';
import { IBasicPaginated } from './types/basic-pagination.type';
import { ICursorPaginated, IEdge } from './types/cursor-pagination.type';

@Injectable()
export class CommonService {
  buff = Buffer;

  public basicPaginate<T>(
    instances: T[],
    totalCount: number,
    page: number,
    pageSize: number,
  ): IBasicPaginated<T> {
    return {
      results: instances,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      hasNextPage: page * pageSize < totalCount,
    };
  }

  public cursorPaginate<T>(
    instances: T[],
    totalCount: number,
    cursor: keyof T,
    first: number,
  ): ICursorPaginated<T> {
    const edges = instances.map<IEdge<T>>((instance) => ({
      node: instance,
      cursor: this.encodeCursor(instance[cursor]),
    }));

    return {
      edges,
      totalCount,
      pageInfo: {
        endCursor: edges[edges.length - 1].cursor,
        hasNextPage: totalCount > first,
      },
    };
  }

  public async updateInstance<I, T>(
    updateInput: I,
    entity: T | any,
  ): Promise<void> {
    Object.keys(updateInput).forEach((key) => {
      if (updateInput[key]) {
        entity[key] = updateInput[key];
      }
    });
    await entity.save();
  }

  public validateSearchInput(search: string): void {
    const regex = /(^[\p{L}_\-.,!\?;:"\s']*$)/u;
    if (search.match(regex).length === 0)
      throw new BadRequestException(
        'Search input can not have special characters',
      );
  }

  public decodeCursor(cursor: string): string {
    return this.buff.from(cursor, 'base64').toString('utf-8');
  }

  private encodeCursor(val: any): string {
    let valToEncode = val;
    if (typeof valToEncode === 'number') valToEncode = valToEncode.toString();

    return this.buff.from(valToEncode, 'utf-8').toString('base64');
  }
}
