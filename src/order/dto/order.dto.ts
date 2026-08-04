import { IsEnum, IsUUID } from 'class-validator';

import { OrderStatus } from 'src/enum';

export class CreateOrderDto {
  @IsUUID()
  addressId: string;
}


export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}