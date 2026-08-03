import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CouponService } from './coupon.service';

import {
  CreateCouponDto,
  UpdateCouponDto,
} from './dto/coupon.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Coupon')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coupon')
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
  ) {}

  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }

  @Post('apply')
  apply(
    @Body()
    body: {
      code: string;
      total: number;
    },
  ) {
    return this.couponService.apply(
      body.code,
      body.total,
    );
  }
}
