import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';
import {
  CreateProductDto,
  PaginationDto,
  StatusDto,
  UpdateProductDto,
} from './dto/product.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { PermissionAction, UserRole } from 'src/enum';

import { UploadedFile, UseInterceptors } from '@nestjs/common';

import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductWithImageDto } from './dto/create-product-with-image.dto';
import { multerOptions } from 'src/common/upload/upload.config';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.CREATE, 'product'])
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProductWithImageDto,
  })
  @UseInterceptors(FileInterceptor('image', multerOptions('product')))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
    @GetUser('id') userId: string,
  ) {
    if (file) {
      dto.image = `http://localhost:3000/uploads/product/${file.filename}`;
    }

    return this.productService.create(dto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  find(@Query() dto: PaginationDto) {
    return this.productService.find(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.UPDATE, 'product'])
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Patch('status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.UPDATE, 'product'])
  status(@Param('id') id: string, @Body() dto: StatusDto) {
    return this.productService.status(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.DELETE, 'product'])
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
