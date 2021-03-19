import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  picture: string;

  @Field(() => String)
  lastLogin: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
