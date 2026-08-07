import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AddressService } from './address.service';
import {
  CreateAddressDto,
  DefaultAddressDto,
  UpdateAddressDto,
} from './dto/address.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Address')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() dto: CreateAddressDto, @GetUser('id') accountId: string) {
    return this.addressService.create(dto, accountId);
  }

  @Get()
  findAll(@GetUser('id') accountId: string) {
    return this.addressService.findAll(accountId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch('default/:id')
  setDefault(@Param('id') id: string, @GetUser('id') accountId: string) {
    return this.addressService.setDefault(id, accountId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
