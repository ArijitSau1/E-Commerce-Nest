import { Account } from 'src/account/entities/account.entity';
import { Address } from 'src/address/entities/address.entity';
import { OrderStatus } from 'src/enum';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  totalAmount: number;

  @Column('decimal', {
  precision: 10,
  scale: 2,
  default: 0,
})
discountAmount: number;

@Column('decimal', {
  precision: 10,
  scale: 2,
})
finalAmount: number;

@Column({
  nullable: true,
})
couponCode: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
