import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private client: ClientProxy;
  private connection: Connection;
  private channel: Channel;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const amqp = require('amqplib');
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error('Failed to initialize RabbitMQ connection', error);
    }
  }

  async publish(queue: string, message: any) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }

    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }
  async getChannel(): Promise<Channel> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    return this.channel;
  }
}
