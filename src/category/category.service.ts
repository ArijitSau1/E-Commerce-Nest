import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { DefaultStatus } from '../enum';
import {
  CreateCategoryDto,
  PaginationDto,
  StatusDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto, createdBy: string) {
    const category = await this.repo.findOne({
      where: { name: dto.name },
    });

    if (category) {
      throw new ConflictException('Category already exists!');
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

    const query = this.repo.createQueryBuilder('category');

    if (dto.status) {
      query.where('category.status = :status', {
        status: dto.status,
      });
    }

    query.andWhere(
      new Brackets((qb) => {
        qb.where(
          'category.name LIKE :keyword OR category.slug LIKE :keyword',
          {
            keyword: `%${keyword}%`,
          },
        );
      }),
    );

    const [result, total] = await query
      .orderBy('category.createdAt', 'DESC')
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return {
      result,
      total,
    };
  }

  async findOne(id: string) {
    const category = await this.repo.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (dto.name) {
      category.name = dto.name;
      category.slug = dto.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-');
    }

    if (dto.image !== undefined) {
      category.image = dto.image;
    }

    return this.repo.save(category);
  }

  async status(id: string, dto: StatusDto) {
    const category = await this.findOne(id);

    category.status = dto.status;

    return this.repo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    category.status = DefaultStatus.DELETED;

    return this.repo.save(category);
  }
}