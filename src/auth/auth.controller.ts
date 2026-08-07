import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GetUser } from './decorators/get-user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({
    default: {
      limit: 10,
      ttl: 60000,
    },
  })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.signIn(dto.loginId, dto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@GetUser() user: any) {
    return user;
  }

  @Throttle({
    default: {
      limit: 3,
      ttl: 600000,
    },
  })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Throttle({
    default: {
      limit: 3,
      ttl: 60000,
    },
  })
  @Post('resend-otp')
  resendOtp(@Body() dto: ForgotPasswordDto) {
    return this.authService.resendOtp(dto);
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @GetUser('id') accountId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(accountId, dto);
  }
}
