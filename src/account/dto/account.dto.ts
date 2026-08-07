import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DefaultStatus, UserRole } from '../../enum';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  roles?: UserRole;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('IN')
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

export class PaginationDto {
  @Type(() => Number)
  offset = 0;

  @Type(() => Number)
  limit = 10;

  @IsOptional()
  keyword?: string;

  @IsOptional()
  @IsEnum(DefaultStatus)
  status?: DefaultStatus = DefaultStatus.ACTIVE;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class StatusDto {
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}
