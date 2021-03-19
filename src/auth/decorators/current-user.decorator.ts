import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IAccessPayload } from '../interfaces/access.payload';

// Copied from "https://docs.nestjs.com/techniques/authentication#graphql"
export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): IAccessPayload => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
