import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailConsumerService } from 'src/email-consumer/email-consumer.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  providers: [EmailService, EmailConsumerService, RabbitMQService],
  exports: [EmailService],
})
export class EmailModule {}
