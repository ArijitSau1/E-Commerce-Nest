import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from 'src/account/entities/account.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';
import { Payment } from 'src/payment/entities/payment.entity';

import { AuthModule } from 'src/auth/auth.module';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Product, Order, Payment, OrderItem]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
