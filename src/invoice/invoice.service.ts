import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './invoice.schema';
import { CreateInvoiceDto } from './create-invoice-dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const newInvoice = new this.invoiceModel(createInvoiceDto);
    return newInvoice.save();
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(id).exec();
  }

  async getAllInvoices(
    startDate?: string,
    endDate?: string,
  ): Promise<Invoice[]> {
    const filter = {};

    if (startDate && endDate) {
      filter['date'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    return this.invoiceModel.find(filter).exec();
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async generateDailySalesSummary() {
    this.logger.log('Running daily sales summary cron job...');
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const invoices = await this.invoiceModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    const summary = this.calculateSummary(invoices);
    this.logger.log(`Daily Sales Summary: ${JSON.stringify(summary)}`);
    await this.publishSummaryToRabbitMQ(summary);
  }

  private async publishSummaryToRabbitMQ(summary: any) {
    try {
      await this.rabbitMQService.publish('daily_sales_report', summary);
      this.logger.log(
        'Successfully published daily sales summary to RabbitMQ.',
      );
    } catch (error) {
      this.logger.error(
        'Failed to publish daily sales summary to RabbitMQ.',
        error.stack,
      );
    }
  }

  private calculateSummary(invoices: Invoice[]) {
    const summary = {
      totalSales: 0,
      itemSummary: {},
    };

    for (const invoice of invoices) {
      summary.totalSales += invoice.amount;

      for (const item of invoice.items) {
        if (!summary.itemSummary[item.sku]) {
          summary.itemSummary[item.sku] = {
            totalQuantity: 0,
          };
        }

        summary.itemSummary[item.sku].totalQuantity += item.qt;
      }
    }

    return summary;
  }
}
