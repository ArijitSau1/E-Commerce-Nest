import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Address } from './entities/address.entity';
import { Account } from 'src/account/entities/account.entity';

import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Account]), AuthModule],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
