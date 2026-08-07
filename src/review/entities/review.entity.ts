import { Account } from 'src/account/entities/account.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({
    type: 'int',
  })
  rating: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  review: string;

  @Column({
    nullable: true,
  })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
