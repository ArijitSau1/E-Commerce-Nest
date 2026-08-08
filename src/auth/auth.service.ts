import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Account } from '../account/entities/account.entity';
import { UserRole } from '../enum';
import APIFeatures from '../utils/apiFeatures.utils';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserPermission } from 'src/user-permission/entities/user-permission.entity';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(Account)
    private readonly repo: Repository<Account>,

    @InjectRepository(UserPermission)
    private readonly upRepo: Repository<UserPermission>,

    private readonly mailService: MailService,
  ) {}

  // ==========================
  // Registration
  // ==========================

  async register(dto: RegisterDto) {
    const account = await this.repo.findOne({
      where: [{ email: dto.email }, { phoneNumber: dto.phoneNumber }],
    });

    if (account) {
      throw new ConflictException('Email or Phone Number already exists!');
    }

    const encryptedPassword = await bcrypt.hash(dto.password, 13);

    const obj = this.repo.create({
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: encryptedPassword,
      roles: UserRole.CUSTOMER,
    });

    const savedUser = await this.repo.save(obj);

   void (async () => {
  try {
    await this.mailService.sendWelcomeEmail(
      savedUser.fullName,
      savedUser.email,
    );
  } catch (error) {
    console.error('Welcome email sending failed:', error);
  }
})();

    return {
      message: 'Registration successful',
    };
  }

  // ==========================
  // Password Recovery
  // ==========================

  async forgotPassword(dto: ForgotPasswordDto) {
    const account = await this.repo.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    // Reset it after 24 hours

    if (
      account.forgotPasswordResetAt &&
      Date.now() - account.forgotPasswordResetAt.getTime() > 24 * 60 * 60 * 1000
    ) {
      account.forgotPasswordCount = 0;
    }

    if (account.forgotPasswordCount >= 3) {
      throw new BadRequestException(
        'You have reached the maximum password reset requests. Please try again after 24 hours.',
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    account.otp = otp;

    account.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    account.forgotPasswordCount += 1;

    account.forgotPasswordResetAt = new Date();

    account.resendOtpCount = 0;

    account.otpAttemptCount = 0;

    await this.repo.save(account);

    await this.mailService.sendOtpEmail(account.fullName, account.email, otp);

    return {
      message: 'OTP sent successfully to your email.',
    };
  }

  async resendOtp(dto: ForgotPasswordDto) {
    const account = await this.repo.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    if (!account.otp) {
      throw new BadRequestException(
        'Please create a forgot password request first.',
      );
    }

    if (account.resendOtpCount >= 3) {
      throw new BadRequestException(
        'Maximum resend attempts reached. Please create a new forgot password request.',
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    account.otp = otp;

    account.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    account.resendOtpCount += 1;

    account.otpAttemptCount = 0;

    await this.repo.save(account);

    await this.mailService.sendOtpEmail(account.fullName, account.email, otp);

    return {
      message: 'OTP resent successfully.',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const account = await this.repo.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    if (!account.otp) {
      throw new BadRequestException('Please request a new OTP.');
    }

    if (!account.otpExpiry) {
      throw new BadRequestException('OTP has expired.');
    }

    if (account.otpExpiry < new Date()) {
      account.otp = undefined;
      account.otpExpiry = undefined;
      account.otpAttemptCount = 0;
      account.isOtpVerified = false;

      await this.repo.save(account);

      throw new BadRequestException(
        'OTP has expired. Please request a new OTP.',
      );
    }

    if (account.otpAttemptCount >= 5) {
      account.otp = undefined;
      account.otpExpiry = undefined;
      account.otpAttemptCount = 0;
      account.isOtpVerified = false;

      await this.repo.save(account);

      throw new BadRequestException(
        'Maximum OTP attempts exceeded. Please request a new OTP.',
      );
    }

    if (account.otp !== dto.otp) {
      account.otpAttemptCount += 1;

      await this.repo.save(account);

      throw new BadRequestException(
        `Invalid OTP. ${5 - account.otpAttemptCount} attempt(s) remaining.`,
      );
    }

    account.isOtpVerified = true;
    account.otpAttemptCount = 0;

    await this.repo.save(account);

    return {
      message: 'OTP verified successfully.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const account = await this.repo.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    if (!account.isOtpVerified) {
      throw new BadRequestException('Please verify your OTP first.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 13);

    account.password = hashedPassword;

    account.otp = undefined;
    account.otpExpiry = undefined;

    account.isOtpVerified = false;

    account.otpAttemptCount = 0;

    account.resendOtpCount = 0;

    await this.repo.save(account);

    return {
      message: 'Password reset successfully.',
    };
  }

  async changePassword(accountId: string, dto: ChangePasswordDto) {
    const account = await this.repo.findOne({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found!');
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      dto.oldPassword,
      account.password,
    );

    if (!isOldPasswordCorrect) {
      throw new BadRequestException('Old password is incorrect.');
    }

    const isSamePassword = await bcrypt.compare(
      dto.newPassword,
      account.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from the current password.',
      );
    }

    account.password = await bcrypt.hash(dto.newPassword, 13);

    await this.repo.save(account);

    return {
      message: 'Password changed successfully.',
    };
  }

  // ==========================
  // Login
  // ==========================

  async signIn(loginId: string, password: string) {
    const account = await this.getUserDetails(loginId);

    const comparePassword = await bcrypt.compare(password, account.password);

    if (!comparePassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = await APIFeatures.assignJwtToken(account.id, this.jwtService);

    return {
      message: 'Login successful',
      token,
    };
  }

  validate(id: string) {
    return this.getUserDetails(id);
  }

  private async getUserDetails(id: string, role?: UserRole): Promise<Account> {
    const query = this.repo.createQueryBuilder('account');

    if (role) {
      query.where('account.roles = :roles', {
        roles: role,
      });
    }

    const result = await query
      .andWhere(
        '(account.id = :id OR account.email = :email OR account.phoneNumber = :phoneNumber)',
        {
          id,
          email: id,
          phoneNumber: id,
        },
      )
      .getOne();

    if (!result) {
      throw new UnauthorizedException('Account not found!');
    }

    return result;
  }

  // ==========================
  // Permissions
  // ==========================

  findPermission(accountId: string) {
    return this.getPermissions(accountId);
  }
  private async getPermissions(accountId: string) {
    return this.upRepo.find({
      relations: {
        permission: true,
        menu: true,
      },
      where: {
        accountId,
        status: true,
      },
    });
  }
}
