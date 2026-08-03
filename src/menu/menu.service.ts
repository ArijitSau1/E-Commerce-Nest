import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly repo: Repository<Menu>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll() {
    const cachedMenus = await this.cacheManager.get<Menu[]>('menus');

    let menus: Menu[];

    if (cachedMenus) {
         console.log('Fetching menus from cache...');
      menus = cachedMenus;
    } else {
        console.log('Fetching menus from database...');
      menus = await this.repo.find();

      await this.cacheManager.set('menus', menus, 0);
    }

    return menus;
  }
}