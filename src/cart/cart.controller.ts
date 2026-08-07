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

import { CartService } from './cart.service';
import { AddCartDto, UpdateCartDto } from './dto/cart.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  add(@Body() dto: AddCartDto, @GetUser('id') accountId: string) {
    return this.cartService.add(dto, accountId);
  }

  @Get()
  findAll(@GetUser('id') accountId: string) {
    return this.cartService.findAll(accountId);
  }

  @Get('summary')
  summary(@GetUser('id') accountId: string) {
    return this.cartService.summary(accountId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCartDto,
    @GetUser('id') accountId: string,
  ) {
    return this.cartService.update(id, dto, accountId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') accountId: string) {
    return this.cartService.remove(id, accountId);
  }

  @Delete()
  clear(@GetUser('id') accountId: string) {
    return this.cartService.clear(accountId);
  }
}
