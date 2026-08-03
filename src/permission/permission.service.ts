import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly repo: Repository<Permission>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll() {
    const cachedPerms = await this.cacheManager.get<Permission[]>('perms');

    let perms: Permission[];

    if (cachedPerms) {
      perms = cachedPerms;
    } else {
      perms = await this.repo.find();
      await this.cacheManager.set('perms', perms, 0);
    }

    return perms;
  }
}
