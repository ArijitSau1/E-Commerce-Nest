
import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateCouponDto } from './createCoupon.dto';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}