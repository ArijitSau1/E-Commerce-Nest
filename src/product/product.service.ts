import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { DefaultStatus, ProductSort } from 'src/enum';
import {
  CreateProductDto,
  PaginationDto,
  StatusDto,
  UpdateProductDto,
} from './dto/product.dto';

import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Brand } from 'src/brand/entities/brand.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async create(dto: CreateProductDto, createdBy: string) {
    const product = await this.repo.findOne({
      where: { name: dto.name },
    });

    if (product) {
      throw new ConflictException('Product already exists!');
    }

    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    const brand = await this.brandRepo.findOne({
      where: { id: dto.brandId },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found!');
    }

    const slug = dto.name.toLowerCase().trim().replace(/\s+/g, '-');

    const obj = this.repo.create({
      name: dto.name,
      slug,
      description: dto.description,
      image: dto.image,
      price: dto.price,
      stock: dto.stock,
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      createdBy,
    });

    return this.repo.save(obj);
  }

  async find(dto: PaginationDto) {
  const keyword = dto.keyword || '';

  const query = this.repo
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.brand', 'brand');

  
  if (dto.status) {
    query.where('product.status = :status', {
      status: dto.status,
    });
  }

  
  query.andWhere(
    new Brackets((qb) => {
      qb.where(
        'product.name LIKE :keyword OR product.slug LIKE :keyword',
        {
          keyword: `%${keyword}%`,
        },
      );
    }),
  );

 
  if (dto.categoryId) {
    query.andWhere('product.categoryId = :categoryId', {
      categoryId: dto.categoryId,
    });
  }

  
  if (dto.brandId) {
    query.andWhere('product.brandId = :brandId', {
      brandId: dto.brandId,
    });
  }

  
  if (dto.minPrice !== undefined) {
    query.andWhere('product.price >= :minPrice', {
      minPrice: dto.minPrice,
    });
  }

  
  if (dto.maxPrice !== undefined) {
    query.andWhere('product.price <= :maxPrice', {
      maxPrice: dto.maxPrice,
    });
  }

  
  switch (dto.sort) {
    case ProductSort.PRICE_ASC:
      query.orderBy('product.price', 'ASC');
      break;

    case ProductSort.PRICE_DESC:
      query.orderBy('product.price', 'DESC');
      break;

    case ProductSort.NEWEST:
    default:
      query.orderBy('product.createdAt', 'DESC');
      break;
  }

  
  const [result, total] = await query
    .skip(dto.offset)
    .take(dto.limit)
    .getManyAndCount();

  return {
    result,
    total,
  };
}

  async findOne(id: string) {
    const product = await this.repo.findOne({
      where: { id },
      relations: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    Object.assign(product, dto);

    if (dto.name) {
      product.slug = dto.name.toLowerCase().trim().replace(/\s+/g, '-');
    }

    return this.repo.save(product);
  }

  async status(id: string, dto: StatusDto) {
    const product = await this.findOne(id);

    product.status = dto.status;

    return this.repo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    product.status = DefaultStatus.DELETED;

    return this.repo.save(product);
  }
}
