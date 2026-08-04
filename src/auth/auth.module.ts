import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '../account/entities/account.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { StringValue } from 'ms';
import { UserPermission } from 'src/user-permission/entities/user-permission.entity';
import { CaslAbilityFactory } from './factory/casl-ability.factory';
import { PermissionsGuard } from './guards/permissions.guard';
import { MailModule } from 'src/mail/mail.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Account,UserPermission]),
    MailModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<StringValue>('JWT_EXPIRE'),
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy, JwtAuthGuard,CaslAbilityFactory,
  PermissionsGuard,],

  exports: [AuthService,JwtStrategy,
  PassportModule,
  JwtModule,CaslAbilityFactory,
  PermissionsGuard,],
})
export class AuthModule {}
