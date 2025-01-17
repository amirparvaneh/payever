import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'sales_queue',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async sendMessage(pattern: string, data: any): Promise<any> {
    return this.client.send(pattern, data).toPromise();
  }
}
