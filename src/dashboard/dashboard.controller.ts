import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';

import { PermissionAction, UserRole } from 'src/enum';


@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,

  )
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.READ, 'dashboard'])
  getDashboard() {
    return this.dashboardService.dashboard();
  }

  @Get('recent-orders')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
  PermissionsGuard,
)
@Roles(UserRole.ADMIN)
@CheckPermissions([PermissionAction.READ, 'dashboard'])
getRecentOrders() {
  return this.dashboardService.recentOrders();
}

@Get('recent-users')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
  PermissionsGuard,
)
@Roles(UserRole.ADMIN)
@CheckPermissions([PermissionAction.READ, 'dashboard'])
getRecentUsers() {
  return this.dashboardService.recentUsers();
}

@Get('top-products')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
  PermissionsGuard,
)
@Roles(UserRole.ADMIN)
@CheckPermissions([PermissionAction.READ, 'dashboard'])
getTopProducts() {
  return this.dashboardService.topProducts();
}
}
