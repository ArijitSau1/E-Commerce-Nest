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

import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  PaginationDto,
  StatusDto,
  UpdateCategoryDto,
} from './dto/category.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';

import { PermissionAction, UserRole } from 'src/enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import { multerOptions } from 'src/common/upload/upload.config';

import { CreateCategoryWithImageDto } from './dto/create-category-with-image.dto';


@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

@Post()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(UserRole.ADMIN)
@CheckPermissions([PermissionAction.CREATE, 'category'])
@ApiConsumes('multipart/form-data')
@ApiBody({
  type: CreateCategoryWithImageDto,
})
@UseInterceptors(
  FileInterceptor(
    'image',
    multerOptions('category'),
  ),
)
create(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: CreateCategoryDto,
  @GetUser('id') userId: string,
) {
  if (file) {
    dto.image = `http://localhost:3000/uploads/category/${file.filename}`;
  }

  return this.categoryService.create(dto, userId);
}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.UPDATE, 'category'])
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, dto);
  }

  @Patch('status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.UPDATE, 'category'])
  status(
    @Param('id') id: string,
    @Body() dto: StatusDto,
  ) {
    return this.categoryService.status(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.DELETE, 'category'])
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}