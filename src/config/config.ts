import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';

export interface IJwt {
  accessSecret: string;
  accessTime: number;
  confirmationSecret: string;
  confirmationTime: number;
  resetPasswordSecret: string;
  resetPasswordTime: number;
  refreshSecret: string;
  refreshTime: number;
}

interface IEmailAuth {
  user: string;
  pass: string;
}

export interface IEmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: IEmailAuth;
}

export interface IConfig {
  port: number;
  production: boolean;
  url: string;
  db: TypeOrmModuleOptions;
  jwt: IJwt;
  jwtService: JwtModuleOptions;
  emailService: IEmailConfig;
}

export default (): IConfig => ({
  port: parseInt(process.env.PORT, 10),
  production: Boolean(process.env.PRODUCTION),
  url: process.env.URL,
  db: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessTime: parseInt(process.env.JWT_ACCESS_TIME, 10),
    confirmationSecret: process.env.JWT_CONFIRMATION_SECRET,
    confirmationTime: parseInt(process.env.JWT_CONFIRMATION_TIME, 10),
    resetPasswordSecret: process.env.JWT_RESET_PASSWORD_SECRET,
    resetPasswordTime: parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshTime: parseInt(process.env.JWT_REFRESH_TIME, 10),
  },
  jwtService: {
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: {
      expiresIn: parseInt(process.env.JWT_ACCESS_TIME, 10),
    },
  },
  emailService: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true' ? true : false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
});
