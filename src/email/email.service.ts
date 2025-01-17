import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(to: string, subject: string, body: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Sales Report" <no-reply@example.com>',
        to,
        subject,
        text: body,
      });

      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error('Failed to send email', error.stack);
      throw new Error('Failed to send email');
    }
  }
}
