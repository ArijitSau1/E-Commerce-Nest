import { IsEnum, IsUUID, IsOptional, IsString} from 'class-validator';

import { OrderStatus } from 'src/enum';

export class CreateOrderDto {
  @IsUUID()
  addressId: string;


  @IsOptional()
  @IsString()
  couponCode?: string
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
