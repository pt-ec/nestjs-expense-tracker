import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType('Category')
export class CategoryType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
