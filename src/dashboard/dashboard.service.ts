import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account } from 'src/account/entities/account.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { OrderStatus } from 'src/enum';
import { OrderItem } from 'src/order/entities/order-item.entity';


@Injectable()
export class DashboardService {
    constructor(
  @InjectRepository(Account)
  private readonly accountRepo: Repository<Account>,

  @InjectRepository(Product)
  private readonly productRepo: Repository<Product>,

  @InjectRepository(Order)
  private readonly orderRepo: Repository<Order>,

  @InjectRepository(Payment)
  private readonly paymentRepo: Repository<Payment>,

  @InjectRepository(OrderItem)
  private readonly orderItemRepo: Repository<OrderItem>,
) {}


async dashboard() {
  const totalUsers = await this.accountRepo.count();

  const totalProducts = await this.productRepo.count();

  const totalOrders = await this.orderRepo.count();

  const pendingOrders = await this.orderRepo.count({
    where: {
      status: OrderStatus.PENDING,
    },
  });

  const deliveredOrders = await this.orderRepo.count({
    where: {
      status: OrderStatus.DELIVERED,
    },
  });

  const cancelledOrders = await this.orderRepo.count({
    where: {
      status: OrderStatus.CANCELLED,
    },
  });

  const payments = await this.paymentRepo.find();

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
  };
}

async recentOrders() {
  const orders = await this.orderRepo.find({
    take: 5,
    order: {
      createdAt: 'DESC',
    },
    relations: {
      account: true,
      address: true,
    },
  });

  return orders.map((order) => ({
  orderId: order.id,
  customer: order.account.fullName,
  email: order.account.email,
  phone: order.account.phoneNumber,
  amount: order.totalAmount,
  status: order.status,
  city: order.address.city,
  state: order.address.state,
  createdAt: order.createdAt,
}));
}

async recentUsers() {
  const users = await this.accountRepo.find({
    take: 5,
    order: {
      createdAt: 'DESC',
    },
  });

  return users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.roles,
    createdAt: user.createdAt,
  }));
}

async topProducts() {
  const products = await this.orderItemRepo
    .createQueryBuilder('orderItem')
    .leftJoinAndSelect(
      'orderItem.product',
      'product',
    )
    .select([
      'product.id AS id',
      'product.name AS name',
      'product.image AS image',
    ])
    .addSelect(
      'SUM(orderItem.quantity)',
      'totalSold',
    )
    .groupBy('product.id')
    .orderBy('totalSold', 'DESC')
    .limit(5)
    .getRawMany();

  return products;
}

}

