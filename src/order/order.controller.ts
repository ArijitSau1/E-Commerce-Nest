import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { UpdateOrderStatusDto } from './dto/order.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionAction, UserRole } from 'src/enum';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';

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

  @Patch(':id/status')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(UserRole.ADMIN)
@CheckPermissions([PermissionAction.UPDATE, 'order'])
updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdateOrderStatusDto,
) {
  return this.orderService.updateStatus(id, dto);
}
}
