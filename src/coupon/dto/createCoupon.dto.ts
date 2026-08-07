import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateCouponDto {
  @IsString()
  code: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  discount: number;

  @IsEnum(CouponType)
  type: CouponType;

  @IsDateString()
  expiryDate: Date;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minimumOrderAmount: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maximumDiscount: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimit?: number = 100;

  @IsOptional()
  @IsBoolean()
  firstOrderOnly?: boolean = false;
}
