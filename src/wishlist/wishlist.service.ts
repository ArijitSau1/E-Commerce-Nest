import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';
import { Product } from 'src/product/entities/product.entity';
import { Account } from 'src/account/entities/account.entity';
import { CreateWishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly repo: Repository<Wishlist>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async add(dto: CreateWishlistDto, accountId: string) {
    const account = await this.accountRepo.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    const exist = await this.repo.findOne({
      where: {
        account: { id: accountId },
        product: { id: dto.productId },
      },
      relations: {
        account: true,
        product: true,
      },
    });

    if (exist) {
      throw new ConflictException('Product already in wishlist!');
    }

    const wishlist = this.repo.create({
      account,
      product,
    });

    return this.repo.save(wishlist);
  }

  async findAll(accountId: string) {
    return this.repo.find({
      where: {
        account: { id: accountId },
      },
      relations: {
        product: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async remove(id: string, accountId: string) {
    const wishlist = await this.repo.findOne({
      where: {
        id,
        account: { id: accountId },
      },
      relations: {
        account: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist item not found!');
    }

    await this.repo.remove(wishlist);

    return {
      message: 'Wishlist item removed successfully',
    };
  }

  async count(accountId: string) {
    const count = await this.repo.count({
      where: {
        account: { id: accountId },
      },
    });

    return {
      count,
    };
  }
}
