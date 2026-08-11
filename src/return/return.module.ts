import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReturnController } from './return.controller';
import { ReturnService } from './return.service';

import { Return } from './entities/return.entity';

import { Order } from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';

import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Return,
      Order,
      OrderItem,
    ]),

    AuthModule,
  ],

  controllers: [
    ReturnController,
  ],

  providers: [
    ReturnService,
  ],

  exports: [
    ReturnService,
  ],
})
export class ReturnModule {}
