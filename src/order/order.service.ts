import {
  BadRequestException,
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
import { MailService } from 'src/mail/mail.service';

import { OrderStatus } from 'src/enum';

import { UpdateOrderStatusDto } from './dto/order.dto';

import { Product } from 'src/product/entities/product.entity';
import { DefaultStatus } from 'src/enum';



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

    private readonly mailService: MailService,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
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
  if (cart.product.status !== DefaultStatus.ACTIVE) {
    throw new BadRequestException(
      `${cart.product.name} is no longer available.`,
    );
  }

  if (cart.quantity > cart.product.stock) {
    throw new BadRequestException(
      `${cart.product.name} has only ${cart.product.stock} item(s) left in stock.`,
    );
  }

  totalAmount += cart.product.price * cart.quantity;
}

    const order = this.orderRepo.create({
  account,
  address,
  totalAmount,
  status: OrderStatus.PENDING,
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

cart.product.stock -= cart.quantity;

if (cart.product.stock === 0) {
  cart.product.status = DefaultStatus.INACTIVE;
}

await this.productRepo.save(cart.product);
    }

    let productHtml = '';

for (const cart of carts) {
  productHtml += `
    <p>
      <b>${cart.product.name}</b><br>
      Quantity: ${cart.quantity}<br>
      Price: ₹${cart.product.price}
    </p>
    <hr>
  `;
}

    await this.cartRepo.remove(carts);

try {
  await this.mailService.sendOrderConfirmationEmail(
    account.fullName,
    account.email,
    savedOrder.id,
    totalAmount,
     productHtml,
  );
} catch (error) {
  console.log('Order email failed:', error);
}

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


async updateStatus(
  id: string,
  dto: UpdateOrderStatusDto,
) {
  const order = await this.orderRepo.findOne({
    where: { id },
    relations: {
      account: true,
    },
  });

  if (!order) {
    throw new NotFoundException('Order not found!');
  }

  const validTransitions: Record<
    OrderStatus,
    OrderStatus[]
  > = {
    [OrderStatus.PENDING]: [
      OrderStatus.CONFIRMED,
      OrderStatus.CANCELLED,
    ],

    [OrderStatus.CONFIRMED]: [
      OrderStatus.SHIPPED,
      OrderStatus.CANCELLED,
    ],

    [OrderStatus.SHIPPED]: [
      OrderStatus.DELIVERED,
    ],

    [OrderStatus.DELIVERED]: [],

    [OrderStatus.CANCELLED]: [],
  };

  const allowed = validTransitions[order.status];

  if (!allowed.includes(dto.status)) {
    throw new BadRequestException(
      `Cannot change order status from ${order.status} to ${dto.status}`,
    );
  }

  order.status = dto.status;

  await this.orderRepo.save(order);

  await this.mailService.sendOrderStatusEmail(
  order.account.fullName,
  order.account.email,
  order.id,
  order.status,
);

  return {
    message: 'Order status updated successfully',
    status: order.status,
  };
}
}
