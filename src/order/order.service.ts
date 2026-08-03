import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

import { Account } from 'src/account/entities/account.entity';
import { Address } from 'src/address/entities/address.entity';
import { Cart } from 'src/cart/entities/cart.entity';

import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
  ) {}

  async create(dto: CreateOrderDto, accountId: string) {
    const account = await this.accountRepo.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    const address = await this.addressRepo.findOne({
      where: {
        id: dto.addressId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found!');
    }

    const carts = await this.cartRepo.find({
      where: {
        account: {
          id: accountId,
        },
      },
      relations: {
        product: true,
      },
    });

    if (carts.length === 0) {
      throw new NotFoundException('Cart is empty!');
    }

    let totalAmount = 0;

    for (const cart of carts) {
      totalAmount += cart.product.price * cart.quantity;
    }

    const order = this.orderRepo.create({
      account,
      address,
      totalAmount,
      status: 'PENDING',
    });

    const savedOrder = await this.orderRepo.save(order);

    for (const cart of carts) {
      const item = this.orderItemRepo.create({
        order: savedOrder,
        product: cart.product,
        quantity: cart.quantity,
        price: cart.product.price,
      });

      await this.orderItemRepo.save(item);
    }

    await this.cartRepo.remove(carts);

    return {
      message: 'Order placed successfully',
      orderId: savedOrder.id,
    };
  }

  async findAll(accountId: string) {
    return this.orderRepo.find({
      where: {
        account: {
          id: accountId,
        },
      },
      relations: {
        address: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({
      where: {
        id,
      },
      relations: {
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    const items = await this.orderItemRepo.find({
      where: {
        order: {
          id,
        },
      },
      relations: {
        product: true,
      },
    });

    return {
      order,
      items,
    };
  }
}
