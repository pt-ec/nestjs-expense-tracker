import { IsString, MinLength, IsEmail } from 'class-validator';

export abstract class SendDto {
  @IsEmail({ allow_display_name: true })
  from: string;

  @IsEmail({ allow_display_name: false }, { each: true })
  to: string[];

  @IsString()
  @MinLength(1)
  subject: string;

  @IsString()
  @MinLength(1)
  text: string;

  @IsString()
  @MinLength(1)
  html: string;
}
