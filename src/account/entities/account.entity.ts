import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { DefaultStatus, UserRole } from '../../enum';
import { UserPermission } from 'src/user-permission/entities/user-permission.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
  })
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
    length: 15,
  })
  phoneNumber: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  roles: UserRole;

  @Column({
    type: 'enum',
    enum: DefaultStatus,
    default: DefaultStatus.ACTIVE,
  })
  status: DefaultStatus;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  otp?: string;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  otpExpiry?: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  forgotPasswordCount: number;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  forgotPasswordResetAt?: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  resendOtpCount: number;

  @Column({
    type: 'int',
    default: 0,
  })
  otpAttemptCount: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isOtpVerified: boolean;

  @Column({
    nullable: true,
  })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserPermission, (userPermission) => userPermission.account)
  userPermission: UserPermission[];
}
