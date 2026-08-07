import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/wishlist.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  add(@Body() dto: CreateWishlistDto, @GetUser('id') accountId: string) {
    return this.wishlistService.add(dto, accountId);
  }

  @Get()
  findAll(@GetUser('id') accountId: string) {
    return this.wishlistService.findAll(accountId);
  }

  @Get('count')
  count(@GetUser('id') accountId: string) {
    return this.wishlistService.count(accountId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') accountId: string) {
    return this.wishlistService.remove(id, accountId);
  }
}
