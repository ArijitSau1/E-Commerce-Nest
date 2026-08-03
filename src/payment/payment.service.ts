import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

import { Payment } from './entities/payment.entity';
import { Order } from 'src/order/entities/order.entity';

import {
  CreatePaymentDto,
  VerifyPaymentDto,
} from './dto/payment.dto';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    private readonly configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID')!,
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET')!,
    });
  }

  async createOrder(dto: CreatePaymentDto) {
    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    const razorpayOrder = await this.razorpay.orders.create({
      amount: Number(order.totalAmount) * 100,
      currency: 'INR',
      receipt: order.id,
    });

    const payment = this.paymentRepo.create({
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: Number(order.totalAmount),
      currency: razorpayOrder.currency,
      status: 'PENDING',
    });

    await this.paymentRepo.save(payment);

    return razorpayOrder;
  }

  async verify(dto: VerifyPaymentDto) {
    const secret = this.configService.get<string>(
      'RAZORPAY_KEY_SECRET',
    )!;

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(
        dto.razorpay_order_id +
          '|' +
          dto.razorpay_payment_id,
      )
      .digest('hex');

    if (generatedSignature !== dto.razorpay_signature) {
      throw new NotFoundException('Invalid Signature');
    }

    const payment = await this.paymentRepo.findOne({
      where: {
        razorpayOrderId: dto.razorpay_order_id,
      },
      relations: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found!');
    }

    payment.razorpayPaymentId = dto.razorpay_payment_id;
    payment.razorpaySignature = dto.razorpay_signature;
    payment.status = 'SUCCESS';

    payment.order.status = 'PAID';

    await this.orderRepo.save(payment.order);
    await this.paymentRepo.save(payment);

    return {
      message: 'Payment Verified Successfully',
    };
  }

  async findByOrder(orderId: string) {
    return this.paymentRepo.findOne({
      where: {
        order: {
          id: orderId,
        },
      },
      relations: {
        order: true,
      },
    });
  }
}
