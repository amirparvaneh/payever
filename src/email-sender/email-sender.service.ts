import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import * as nodemailer from 'nodemailer';

interface ItemSummary {
  totalQuantity: number;
}

interface SalesReport {
  totalSales: number;
  itemSummary: Record<string, ItemSummary>;
}

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  constructor(private readonly rabbitMQService: RabbitMQService) {
    this.startListening();
  }

  private async startListening() {
    const queueName = 'daily_sales_report';

    try {
      const channel = await this.rabbitMQService.getChannel();
      await channel.assertQueue(queueName, { durable: true });

      channel.consume(
        queueName,
        async (message) => {
          if (message) {
            const report = JSON.parse(message.content.toString());
            this.logger.log(`Received message: ${JSON.stringify(report)}`);

            try {
              await this.sendEmailWithReport(report);
              channel.ack(message);
            } catch (error) {
              this.logger.error(
                'Error while processing the report',
                error.stack,
              );
            }
          }
        },
        { noAck: false },
      );

      this.logger.log(`Listening for messages on queue: ${queueName}`);
    } catch (error) {
      this.logger.error('Failed to set up RabbitMQ consumer', error.stack);
    }
  }

  private async sendEmailWithReport(report: any) {
    const emailBody = this.formatReport(report);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const recipientEmail = 'recipient@example.com';

    await transporter.sendMail({
      from: '"Daily Sales Report" <no-reply@example.com>',
      to: recipientEmail,
      subject: 'Your Daily Sales Report',
      text: emailBody,
    });

    this.logger.log(`Email sent to ${recipientEmail}`);
  }

  private formatReport(report: SalesReport): string {
    let body = `Daily Sales Report\n\nTotal Sales: ${report.totalSales}\n\nItem Summary:\n`;
    for (const [sku, summary] of Object.entries(report.itemSummary)) {
      body += `- SKU: ${sku}, Total Quantity Sold: ${summary.totalQuantity}\n`;
    }

    return body;
  }
}
