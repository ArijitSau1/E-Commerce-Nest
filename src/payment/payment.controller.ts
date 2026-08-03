import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  VerifyPaymentDto,
} from './dto/payment.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Post('create-order')
  createOrder(
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentService.createOrder(dto);
  }

  @Post('verify')
  verify(
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentService.verify(dto);
  }

  @Get('order/:id')
  findByOrder(
    @Param('id') id: string,
  ) {
    return this.paymentService.findByOrder(id);
  }
}
