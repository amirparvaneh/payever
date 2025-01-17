import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      auth: {
        user: 'your-email@example.com',
        pass: 'your-email-password',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: '"Sales Report" <no-reply@example.com>', // Replace with sender info
      to,
      subject,
      text,
    });
    return `Email sent: ${info.messageId}`;
  }
}
