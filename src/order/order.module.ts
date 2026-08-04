import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { Account } from 'src/account/entities/account.entity';
import { Address } from 'src/address/entities/address.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Account,
      Address,
      Cart,
      Product,
    ]),
    AuthModule,
    MailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}