import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { DefaultStatus } from '../enum';
import {
  CreateBrandDto,
  PaginationDto,
  StatusDto,
  UpdateBrandDto,
} from './dto/brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
  ) {}

  async create(dto: CreateBrandDto, createdBy: string) {
    const brand = await this.repo.findOne({
      where: { name: dto.name },
    });

    if (brand) {
      throw new ConflictException('Brand already exists!');
    }

    const slug = dto.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');

    const obj = this.repo.create({
      name: dto.name,
      slug,
      image: dto.image,
      createdBy,
    });

    return this.repo.save(obj);
  }

  async find(dto: PaginationDto) {
    const keyword = dto.keyword || '';

    const query = this.repo.createQueryBuilder('brand');

    if (dto.status) {
      query.where('brand.status = :status', {
        status: dto.status,
      });
    }

    query.andWhere(
      new Brackets((qb) => {
        qb.where(
          'brand.name LIKE :keyword OR brand.slug LIKE :keyword',
          {
            keyword: `%${keyword}%`,
          },
        );
      }),
    );

    const [result, total] = await query
      .orderBy('brand.createdAt', 'DESC')
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return {
      result,
      total,
    };
  }

  async findOne(id: string) {
    const brand = await this.repo.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found!');
    }

    return brand;
  }

  async update(id: string, dto: UpdateBrandDto) {
    const brand = await this.findOne(id);

    if (dto.name) {
      brand.name = dto.name;
      brand.slug = dto.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-');
    }

    if (dto.image !== undefined) {
      brand.image = dto.image;
    }

    return this.repo.save(brand);
  }

  async status(id: string, dto: StatusDto) {
    const brand = await this.findOne(id);

    brand.status = dto.status;

    return this.repo.save(brand);
  }

  async remove(id: string) {
    const brand = await this.findOne(id);

    brand.status = DefaultStatus.DELETED;

    return this.repo.save(brand);
  }
}