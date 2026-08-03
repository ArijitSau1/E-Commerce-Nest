import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Coupon } from './entities/coupon.entity';
import {
  CreateCouponDto,
  UpdateCouponDto,
} from './dto/coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly repo: Repository<Coupon>,
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

  async apply(code: string, total: number) {
    const coupon = await this.repo.findOne({
      where: {
        code,
        isActive: true,
      },
    });

    if (!coupon) {
      throw new NotFoundException('Invalid coupon!');
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      throw new ConflictException('Coupon expired!');
    }

    let discount = 0;

    if (coupon.type === 'PERCENTAGE') {
      discount = (total * Number(coupon.discount)) / 100;
    } else {
      discount = Number(coupon.discount);
    }

    return {
      coupon: coupon.code,
      discount,
      finalAmount: total - discount,
    };
  }
}
