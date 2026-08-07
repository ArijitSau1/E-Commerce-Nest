import { Controller, Get, UseGuards } from '@nestjs/common';

import { PermissionAction, UserRole } from 'src/enum';

import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('account')
export class AccountController {
  @Get('test-permission')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.READ, 'category'])
  testPermission() {
    return {
      message: 'Permission Granted',
    };
  }
}
