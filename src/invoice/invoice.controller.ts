import { Controller, Post, Body, Get } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './create-invoice-dto';
import { Param } from '@nestjs/common';
import { Query } from '@nestjs/common';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }

  @Get()
  async getAllInvoices(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.invoiceService.getAllInvoices(startDate, endDate);
  }
}
