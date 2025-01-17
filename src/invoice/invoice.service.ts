import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './invoice.schema';
import { CreateInvoiceDto } from './create-invoice-dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
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
}
