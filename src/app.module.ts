import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NModule } from './n/n.module';
import { RabbitModule } from './rabbit/rabbit.module';

@Module({
  imports: [NModule, RabbitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
