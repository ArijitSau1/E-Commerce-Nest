import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DefaultStatus } from '../../enum';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 120,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image: string;

  @Column({
    type: 'enum',
    enum: DefaultStatus,
    default: DefaultStatus.ACTIVE,
  })
  status: DefaultStatus;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
