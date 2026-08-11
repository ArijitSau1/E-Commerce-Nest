import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

import {
  ReturnStatus,
  ReturnType,
} from 'src/enum';

export class CreateReturnDto {
  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  @IsNotEmpty()
  @IsUUID()
  orderItemId: string;

  @IsNotEmpty()
  @IsEnum(ReturnType)
  type: ReturnType;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}

export class UpdateReturnStatusDto {
  @IsNotEmpty()
  @IsEnum(ReturnStatus)
  status: ReturnStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminRemark?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  refundAmount?: number;
}