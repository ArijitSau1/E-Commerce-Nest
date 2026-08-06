import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

import { Order } from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService], 
})
export class InvoiceModule {}