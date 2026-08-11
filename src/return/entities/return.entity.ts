import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ReturnStatus, ReturnType } from 'src/enum';

@Entity('returns')
export class Return {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  accountId: string;

  @Column('uuid')
  orderId: string;

  @Column('uuid')
  orderItemId: string;

  @Column({
    type: 'enum',
    enum: ReturnType,
  })
  type: ReturnType;

  @Column({
    type: 'enum',
    enum: ReturnStatus,
    default: ReturnStatus.REQUESTED,
  })
  status: ReturnStatus;

  @Column({
    type: 'varchar',
    length: 500,
  })
  reason: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
  })
  refundAmount: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  adminRemark: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}