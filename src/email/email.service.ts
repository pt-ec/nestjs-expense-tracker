import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { IEmailConfig } from '../config/config';
import Mail from 'nodemailer/lib/mailer';
import { SendDto } from './dtos/send.dto';
import { User } from '../auth/repository/user.entity';
import { confirmEmail } from './html/confirmation.html';
import { resetPassword } from './html/password-reset.html';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  public async sendEmail(sendMailDto: SendDto): Promise<void> {
    const transport = this.createTransporter();
    const { to, ...rest } = sendMailDto;

    const loopedTo = to.length > 1 ? to.join(', ') : to[0];
    try {
      await transport.sendMail({
        ...rest,
        to: loopedTo,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async sendConfirmationEmail(
    email: string,
    username: string,
    url: string,
  ): Promise<void> {
    await this.sendEmail({
      from: '"Tracky Track" <no-reply@trackytrack.com>',
      to: [email],
      subject: `Confirm your account ${username}`,
      text: `Please confirm your email. Your activation link is: ${url}`,
      html: confirmEmail(username, url),
    });
  }

  public async sendPasswordResetEmail(user: User, url: string): Promise<void> {
    await this.sendEmail({
      from: '"Tracky Track" <no-reply@trackytrack.com>',
      to: [user.email],
      subject: `Reset your password ${user.username}`,
      text: `Your password rejection link: ${url}`,
      html: resetPassword(user.username, url),
    });
  }

  private createTransporter(): Mail {
    return createTransport(
      this.configService.get<IEmailConfig>('emailService'),
    );
  }
}
