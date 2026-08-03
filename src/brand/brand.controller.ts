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

import { BrandService } from './brand.service';
import {
  CreateBrandDto,
  PaginationDto,
  StatusDto,
  UpdateBrandDto,
} from './dto/brand.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { PermissionAction, UserRole } from 'src/enum';

@ApiTags('Brand')
@ApiBearerAuth()
@Controller('brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.CREATE, 'brand'])
  create(
    @Body() dto: CreateBrandDto,
    @GetUser('id') userId: string,
  ) {
    return this.brandService.create(dto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  find(@Query() dto: PaginationDto) {
    return this.brandService.find(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.UPDATE, 'brand'])
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    return this.brandService.update(id, dto);
  }

  @Patch('status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.UPDATE, 'brand'])
  status(
    @Param('id') id: string,
    @Body() dto: StatusDto,
  ) {
    return this.brandService.status(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.DELETE, 'brand'])
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}