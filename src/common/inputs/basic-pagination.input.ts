import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@InputType('BasicPagination')
export abstract class BasicPaginationInput {
  @IsInt()
  @Min(1)
  @Max(100)
  @Field(() => Int, { defaultValue: 10 })
  pageSize: number;

  @IsInt()
  @Min(1)
  @Field(() => Int, { defaultValue: 1 })
  page: number;
}
