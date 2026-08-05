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



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.signIn(dto.loginId, dto.password);
  }

  @Get('profile')
@UseGuards(JwtAuthGuard)
profile(@GetUser() user: any) {
  return user;
}

@Post('forgot-password')
forgotPassword(
  @Body() dto: ForgotPasswordDto,
) {
  return this.authService.forgotPassword(dto);
}


@Post('resend-otp')
resendOtp(
  @Body() dto: ForgotPasswordDto,
) {
  return this.authService.resendOtp(dto);
}


@Post('verify-otp')
verifyOtp(
  @Body() dto: VerifyOtpDto,
) {
  return this.authService.verifyOtp(dto);
}


@Post('reset-password')
resetPassword(
  @Body() dto: ResetPasswordDto,
) {
  return this.authService.resetPassword(dto);
}


@Patch('change-password')
@UseGuards(JwtAuthGuard)
changePassword(
  @GetUser('id') accountId: string,
  @Body() dto: ChangePasswordDto,
) {
  return this.authService.changePassword(
    accountId,
    dto,
  );
}

}
