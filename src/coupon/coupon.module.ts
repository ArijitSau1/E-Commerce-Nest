import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Coupon } from './entities/coupon.entity';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

import { AuthModule } from 'src/auth/auth.module';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon,Order]), AuthModule],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
