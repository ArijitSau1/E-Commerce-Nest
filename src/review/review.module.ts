import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

import { Account } from 'src/account/entities/account.entity';
import { Product } from 'src/product/entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      Product,
      Account,
      OrderItem
    ]),
    AuthModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}