import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @GetUser('id') accountId: string,
  ) {
    return this.orderService.create(dto, accountId);
  }

  @Get()
  findAll(
    @GetUser('id') accountId: string,
  ) {
    return this.orderService.findAll(accountId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.orderService.findOne(id);
  }
}
