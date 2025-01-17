import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  providers: [EmailSenderService, RabbitMQService],
})
export class EmailSenderModule {}
