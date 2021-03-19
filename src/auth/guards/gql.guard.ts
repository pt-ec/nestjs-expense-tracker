import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

// Copied from "https://docs.nestjs.com/techniques/authentication#graphql"
@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') {
  public getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
