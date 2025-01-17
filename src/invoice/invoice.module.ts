import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceSchema } from './invoice.schema';
import { Invoice } from './invoice.schema';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
  providers: [InvoiceService, RabbitMQService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
