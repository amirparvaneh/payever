import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { InvoiceModule } from './invoice/invoice.module';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailConsumerService } from './email-consumer/email-consumer.service';
import { EmailSenderModule } from './email-sender/email-sender.module';

@Module({
  imports: [
    RabbitmqModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/sales-invoice-app'),
    RabbitmqModule,
    InvoiceModule,
    EmailModule,
    EmailSenderModule,
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMQService, EmailConsumerService],
})
export class AppModule {}
