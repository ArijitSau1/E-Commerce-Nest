import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

@Entity('coupon')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  code: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  discount: number;

  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.PERCENTAGE,
  })
  type: CouponType;

  @Column()
  expiryDate: Date;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  minimumOrderAmount: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  maximumDiscount: number;

  @Column({
    default: 100,
  })
  usageLimit: number;

  @Column({
    default: 0,
  })
  usedCount: number;

  @Column({
    default: false,
  })
  firstOrderOnly: boolean;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}