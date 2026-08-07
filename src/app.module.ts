import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { PermissionModule } from './permission/permission.module';
import { UserPermissionModule } from './user-permission/user-permission.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module';
import { AddressModule } from './address/address.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { CouponModule } from './coupon/coupon.module';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DashboardModule } from './dashboard/dashboard.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AccountModule,

    AuthModule,

    MenuModule,

    PermissionModule,

    UserPermissionModule,

    CategoryModule,
    BrandModule,
    ProductModule,
    WishlistModule,
    CartModule,
    AddressModule,
    OrderModule,
    PaymentModule,
    ReviewModule,
    CouponModule,
    MailModule,
    DashboardModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
