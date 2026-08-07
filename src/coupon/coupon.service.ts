import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';

import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/createCoupon.dto';
import { UpdateCouponDto } from './dto/updateCoupon.dto';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly repo: Repository<Coupon>,

     @InjectRepository(Order)
  private readonly orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreateCouponDto) {
    const exists = await this.repo.findOne({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('Coupon already exists!');
    }

    const coupon = this.repo.create(dto);

    return this.repo.save(coupon);
  }

  async findAll() {
    return this.repo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const coupon = await this.repo.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found!');
    }

    return coupon;
  }

  async update(id: string, dto: UpdateCouponDto) {
    const coupon = await this.findOne(id);

    Object.assign(coupon, dto);

    return this.repo.save(coupon);
  }

  async remove(id: string) {
    const coupon = await this.findOne(id);

    await this.repo.remove(coupon);

    return {
      message: 'Coupon deleted successfully',
    };
  }

 async apply(code: string, total: number, accountId?: string,
) {
  const coupon = await this.repo.findOne({
    where: {
      code: code.toUpperCase(),
      isActive: true,
    },
  });

  if (!coupon) {
    throw new NotFoundException(
      'Invalid coupon!',
    );
  }

  // Check expiry
  if (new Date(coupon.expiryDate) < new Date()) {
    throw new ConflictException(
      'Coupon has expired!',
    );
  }

  // Minimum order amount
  if (
    total <
    Number(coupon.minimumOrderAmount)
  ) {
    throw new ConflictException(
      `Minimum order amount is ₹${coupon.minimumOrderAmount}`,
    );
  }

  // Usage limit
  if (
    coupon.usedCount >=
    coupon.usageLimit
  ) {
    throw new ConflictException(
      'Coupon usage limit exceeded!',
    );
  }

  // First order coupon
if (
  coupon.firstOrderOnly &&
  accountId
) {
  const totalOrders =
    await this.orderRepo.count({
      where: {
        account: {
          id: accountId,
        },
      },
    });

  if (totalOrders > 0) {
    throw new ConflictException(
      'This coupon is only valid for your first order.',
    );
  }
}

  let discount = 0;

  // Percentage coupon
  if (
    coupon.type === 'PERCENTAGE'
  ) {
    discount =
      (total * Number(coupon.discount)) /
      100;

    // Maximum discount
    if (
      coupon.maximumDiscount > 0 &&
      discount >
        Number(coupon.maximumDiscount)
    ) {
      discount = Number(
        coupon.maximumDiscount,
      );
    }
  }

  // Fixed coupon
  else {
    discount = Number(coupon.discount);
  }

  // Final amount never below 0
  const finalAmount = Math.max(
    total - discount,
    0,
  );

  return {
    couponId: coupon.id,
    couponCode: coupon.code,
    discount,
    finalAmount,
  };
}

async increaseUsage(code: string) {
  const coupon = await this.repo.findOne({
    where: {
      code: code.toUpperCase(),
    },
  });

  if (!coupon) {
    return;
  }

  coupon.usedCount++;

  await this.repo.save(coupon);
}
}
