import {
  ConflictException,
  Injectable,
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

  async register(dto: RegisterDto) {
  const account = await this.repo.findOne({
    where: [
      { email: dto.email },
      { phoneNumber: dto.phoneNumber },
    ],
  });

  if (account) {
    throw new ConflictException(
      'Email or Phone Number already exists!',
    );
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

  try {
    await this.mailService.sendWelcomeEmail(
      savedUser.fullName,
      savedUser.email,
    );
  } catch (error) {
    console.log('Email sending failed:', error);
  }

  return {
    message: 'Registration successful',
  };
}

  async signIn(loginId: string, password: string) {
    const account = await this.getUserDetails(loginId);

    const comparePassword = await bcrypt.compare(
      password,
      account.password,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = await APIFeatures.assignJwtToken(
      account.id,
      this.jwtService,
    );

    return {
      message: 'Login successful',
      token,
    };
  }

  validate(id: string) {
    return this.getUserDetails(id);
  }

  private async getUserDetails(
    id: string,
    role?: UserRole,
  ): Promise<Account> {
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

