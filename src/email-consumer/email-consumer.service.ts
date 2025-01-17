import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { EmailService } from 'src/email/email.service';

interface ItemSummary {
  totalQuantity: number;
}

interface SalesReport {
  totalSales: number;
  itemSummary: Record<string, ItemSummary>;
}

@Injectable()
export class EmailConsumerService {
  private readonly logger = new Logger(EmailConsumerService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly emailService: EmailService,
  ) {
    this.startListening();
  }

  private async startListening() {
    try {
      const queue = 'daily_sales_report';
      const channel = await this.rabbitMQService.getChannel();

      await channel.assertQueue(queue, { durable: true });

      channel.consume(
        queue,
        async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.logger.log(
              `Received message from ${queue}: ${JSON.stringify(content)}`,
            );
            await this.handleSalesReport(content);
            channel.ack(message);
          }
        },
        { noAck: false },
      );
    } catch (error) {
      this.logger.error('Error setting up RabbitMQ consumer', error.stack);
    }
  }

  private async handleSalesReport(report: any) {
    const emailBody = this.formatReport(report);
    await this.emailService.sendEmail(
      'recipient@example.com',
      'Daily Sales Report',
      emailBody,
    );
  }

  private formatReport(report: SalesReport): string {
    let body = `Daily Sales Report\n\nTotal Sales: ${report.totalSales}\n\nItem Summary:\n`;
    for (const [sku, summary] of Object.entries(report.itemSummary)) {
      body += `- SKU: ${sku}, Total Quantity Sold: ${summary.totalQuantity}\n`;
    }

    return body;
  }
}
