import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DefaultStatus } from 'src/enum';
import { Cart } from './entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Account } from 'src/account/entities/account.entity';
import { AddCartDto, UpdateCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly repo: Repository<Cart>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async add(dto: AddCartDto, accountId: string) {
    const account = await this.accountRepo.findOne({
      where: { id: accountId },
    });

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });

    if (!account) throw new NotFoundException('Account not found!');
    if (!product) throw new NotFoundException('Product not found!');

    if (product.status !== DefaultStatus.ACTIVE) {
  throw new BadRequestException(
    'Product is no longer available.',
  );
}

if (dto.quantity > product.stock) {
  throw new BadRequestException(
    `Only ${product.stock} item(s) available in stock.`,
  );
}

    let cart = await this.repo.findOne({
      where: {
        account: { id: accountId },
        product: { id: dto.productId },
      },
      relations: {
        account: true,
        product: true,
      },
    });

   if (cart) {
  const totalQuantity = cart.quantity + dto.quantity;

  if (totalQuantity > product.stock) {
    throw new BadRequestException(
      `Only ${product.stock} item(s) available in stock.`,
    );
  }

  cart.quantity = totalQuantity;

  return this.repo.save(cart);
}

    cart = this.repo.create({
      account,
      product,
      quantity: dto.quantity,
    });

    return this.repo.save(cart);
  }

  async findAll(accountId: string) {
    return this.repo.find({
      where: {
        account: { id: accountId },
      },
      relations: {
        product: true,
      },
    });
  }

  async update(id: string, dto: UpdateCartDto) {
    const cart = await this.repo.findOne({
      where: { id },
    });

    if (!cart) {
      throw new NotFoundException('Cart item not found!');
    }

    cart.quantity = dto.quantity;

    return this.repo.save(cart);
  }

  async remove(id: string) {
    const cart = await this.repo.findOne({
      where: { id },
    });

    if (!cart) {
      throw new NotFoundException('Cart item not found!');
    }

    await this.repo.remove(cart);

    return {
      message: 'Cart item removed successfully',
    };
  }

  async clear(accountId: string) {
    await this.repo.delete({
      account: {
        id: accountId,
      },
    });

    return {
      message: 'Cart cleared successfully',
    };
  }

  async summary(accountId: string) {
    const carts = await this.repo.find({
      where: {
        account: { id: accountId },
      },
      relations: {
        product: true,
      },
    });

    let grandTotal = 0;
    let totalItems = 0;

    const items = carts.map((item) => {
      const subtotal = item.product.price * item.quantity;

      grandTotal += subtotal;
      totalItems += item.quantity;

      return {
        product: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal,
      };
    });

    return {
      items,
      totalItems,
      grandTotal,
    };
  }
}