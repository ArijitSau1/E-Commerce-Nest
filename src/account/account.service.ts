import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Brackets, Repository } from 'typeorm';

import { DefaultStatus, UserRole } from 'src/enum';
import {
  CreateAccountDto,
  PaginationDto,
  StatusDto,
  UpdateAccountDto,
} from './dto/account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
  ) {}

  async create(dto: CreateAccountDto, createdBy: string) {
    const user = await this.repo.findOne({
      where: [
        { email: dto.email },
        { phoneNumber: dto.phoneNumber },
      ],
    });

    if (user) {
      throw new ConflictException(
        'Email or Phone Number already exists!',
      );
    }

    const encryptedPassword = await bcrypt.hash(dto.password, 13);

    const obj = this.repo.create({
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: encryptedPassword,
      createdBy,
      roles: dto.roles ?? UserRole.CUSTOMER,
      status: DefaultStatus.ACTIVE,
    });

    return await this.repo.save(obj);
  }

  async find(dto: PaginationDto, createdBy: string) {
    const keyword = dto.keyword || '';

    const query = this.repo
      .createQueryBuilder('account')
      .where(
        'account.status = :status AND account.createdBy = :createdBy',
        {
          status: dto.status ?? DefaultStatus.ACTIVE,
          createdBy,
        },
      );

    if (dto.role) {
      query.andWhere('account.roles = :roles', {
        roles: dto.role,
      });
    }

    query.andWhere(
      new Brackets((qb) => {
        qb.where('account.fullName LIKE :keyword', {
          keyword: `%${keyword}%`,
        })
          .orWhere('account.email LIKE :keyword', {
            keyword: `%${keyword}%`,
          })
          .orWhere('account.phoneNumber LIKE :keyword', {
            keyword: `%${keyword}%`,
          });
      }),
    );

    const [result, total] = await query
      .orderBy('account.createdAt', 'DESC')
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return {
      result,
      total,
    };
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async update(id: string, dto: UpdateAccountDto) {
    const user = await this.findOne(id);

    const obj = Object.assign(user, dto);

    return this.repo.save(obj);
  }

  async status(id: string, status: StatusDto) {
    const user = await this.findOne(id);

    const obj = Object.assign(user, status);

    return this.repo.save(obj);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    const obj = Object.assign(user, {
      status: DefaultStatus.DELETED,
    });

    return this.repo.save(obj);
  }

  async findAllCustomerPhone() {
    return this.repo
      .createQueryBuilder('account')
      .select([
        'account.phoneNumber',
      ])
      .where(
        'account.status = :status AND account.roles = :roles',
        {
          status: DefaultStatus.ACTIVE,
          roles: UserRole.CUSTOMER,
        },
      )
      .getMany();
  }
}