import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../repository/user.entity';
import { UserType } from './user.type';

@ObjectType('Access')
export class AccessType {
  @Field(() => String)
  accessToken: string;

  @Field(() => UserType)
  user: User;
}
