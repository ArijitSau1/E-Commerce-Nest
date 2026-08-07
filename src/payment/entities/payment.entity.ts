import { Order } from 'src/order/entities/order.entity';
import { PaymentStatus } from 'src/enum';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  razorpayOrderId: string;

  @Column({
    nullable: true,
  })
  razorpayPaymentId: string;

  @Column({
    nullable: true,
  })
  razorpaySignature: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({
    default: 'INR',
  })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
