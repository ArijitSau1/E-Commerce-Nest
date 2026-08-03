import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Address } from './entities/address.entity';
import { Account } from 'src/account/entities/account.entity';

import {
  CreateAddressDto,
  UpdateAddressDto,
} from './dto/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly repo: Repository<Address>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async create(dto: CreateAddressDto, accountId: string) {
    const account = await this.accountRepo.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    const address = this.repo.create({
      ...dto,
      account,
    });

    return this.repo.save(address);
  }

  async findAll(accountId: string) {
    return this.repo.find({
      where: {
        account: {
          id: accountId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const address = await this.repo.findOne({
      where: { id },
      relations: {
        account: true,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found!');
    }

    return address;
  }

  async update(id: string, dto: UpdateAddressDto) {
    const address = await this.findOne(id);

    Object.assign(address, dto);

    return this.repo.save(address);
  }

 async setDefault(id: string, accountId: string) {
  // Get all addresses of this user
  const addresses = await this.repo.find({
    where: {
      account: {
        id: accountId,
      },
    },
    relations: {
      account: true,
    },
  });

  // Reset all to false
  for (const item of addresses) {
    item.isDefault = false;
    await this.repo.save(item);
  }

  // Find selected address
  const address = addresses.find((item) => item.id === id);

  if (!address) {
    throw new NotFoundException('Address not found!');
  }

  // Set selected one as default
  address.isDefault = true;

  await this.repo.save(address);

  return {
    message: 'Default address updated successfully',
  };
}

  async remove(id: string) {
    const address = await this.findOne(id);

    await this.repo.remove(address);

    return {
      message: 'Address deleted successfully',
    };
  }
}