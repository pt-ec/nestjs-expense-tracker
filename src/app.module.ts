import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { CategoriesModule } from './categories/categories.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CommonModule } from './common/common.module';
import validationSchema from './config/validation';
import config from './config/config';
import TypeOrmConfig from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }),
    GraphQLModule.forRoot({
      context: ({ req, res }) => ({ req, res }),
      path: '/graphql',
      autoSchemaFile: './schema.gql',
      debug: true,
      playground: true,
      sortSchema: true,
      uploads: {
        maxFileSize: 500000,
        maxFiles: 1,
      },
    }),
    AuthModule,
    EmailModule,
    CategoriesModule,
    ExpensesModule,
    CommonModule,
  ],
  providers: [AppService],
})
export class AppModule {}
