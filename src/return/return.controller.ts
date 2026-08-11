import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';

import {
  PermissionAction,
  UserRole,
} from 'src/enum';

import {
  CreateReturnDto,
  UpdateReturnStatusDto,
} from './dto/return.dto';

import { ReturnService } from './return.service';

@ApiTags('Return')
@ApiBearerAuth()
@Controller('return')
export class ReturnController {
  constructor(
    private readonly returnService: ReturnService,
  ) {}



  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateReturnDto,
    @GetUser('id') accountId: string,
  ) {
    return this.returnService.create(
      dto,
      accountId,
    );
  }



  @Get()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
  )
  @Roles(UserRole.ADMIN)
  @CheckPermissions([
    PermissionAction.READ,
    'return',
  ])
  findAll() {
    return this.returnService.findAll();
  }



  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyReturns(
    @GetUser('id') accountId: string,
  ) {
    return this.returnService.findMyReturns(
      accountId,
    );
  }



  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
  ) {
    return this.returnService.findOne(id);
  }


  @Patch('status/:id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
  )
  @Roles(UserRole.ADMIN)
  @CheckPermissions([
    PermissionAction.UPDATE,
    'return',
  ])
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReturnStatusDto,
  ) {
    return this.returnService.updateStatus(
      id,
      dto,
    );
  }
}