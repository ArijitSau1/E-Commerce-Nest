import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entities/review.entity';
import { Product } from 'src/product/entities/product.entity';
import { Account } from 'src/account/entities/account.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { OrderStatus } from 'src/enum';


import {
  CreateReviewDto,
  UpdateReviewDto,
} from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  async create(dto: CreateReviewDto, accountId: string) {
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

   const deliveredOrder = await this.orderItemRepo.findOne({
  where: {
    product: {
      id: dto.productId,
    },
    order: {
      account: {
        id: accountId,
      },
      status: OrderStatus.DELIVERED,
    },
  },
  relations: {
    order: true,
    product: true,
  },
});

if (!deliveredOrder) {
  throw new BadRequestException(
    'You can review this product only after it has been delivered.',
  );
}


    const exists = await this.reviewRepo.findOne({
      where: {
        account: { id: accountId },
        product: { id: dto.productId },
      },
    });

    if (exists) {
      throw new ConflictException('You already reviewed this product.');
    }

   const review = this.reviewRepo.create({
  rating: dto.rating,
  review: dto.review,
  image: dto.image,
  account,
  product,
});

    return this.reviewRepo.save(review);
  }

  async findByProduct(productId: string) {
    return this.reviewRepo.find({
      where: {
        product: {
          id: productId,
        },
      },
      relations: {
        account: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async myReviews(accountId: string) {
    return this.reviewRepo.find({
      where: {
        account: {
          id: accountId,
        },
      },
      relations: {
        product: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async update(id: string, dto: UpdateReviewDto, accountId: string,) {
    const review = await this.reviewRepo.findOne({
  where: {
    id,
    account: {
      id: accountId,
    },
  },
});

    if (!review) {
      throw new NotFoundException('Review not found!');
    }

    Object.assign(review, dto);

    return this.reviewRepo.save(review);
  }

  async remove(id: string,accountId: string,) {
    const review = await this.reviewRepo.findOne({
  where: {
    id,
    account: {
      id: accountId,
    },
  },
});

    if (!review) {
      throw new NotFoundException('Review not found!');
    }

    await this.reviewRepo.remove(review);

    return {
      message: 'Review deleted successfully',
    };
  }
}
