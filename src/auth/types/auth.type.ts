import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../repository/user.entity';
import { UserType } from './user.type';

@ObjectType('Auth')
export class AuthType {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserType)
  user: User;
}
