import { Field, ObjectType } from '@nestjs/graphql';
import { AlertStatusEnum } from '../enums/alert-status.enum';

@ObjectType('Alert')
export abstract class AlertType {
  @Field()
  status: AlertStatusEnum;

  @Field()
  message: string;
}
