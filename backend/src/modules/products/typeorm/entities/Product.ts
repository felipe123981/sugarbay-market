import Customer from '@modules/customers/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/typeorm/entities/OrdersProducts';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true, default: null })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  @Column('string')
  customer_id: Customer;

  @OneToMany(() => OrdersProducts, order_products => order_products.product)
  order_products: OrdersProducts[];

  @Column('int')
  quantity: number;

  @Column('varchar', { array: true })
  photos: string[];

  @Column('varchar', { array: true, nullable: true })
  categories: string[];

  @Column('varchar', { nullable: true })
  size: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  number: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  width: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  height: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  length: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column('varchar', { nullable: true })
  brand: string;

  @Column('varchar', { nullable: true })
  model: string;

  @Column('varchar', { nullable: true })
  color: string;

  @Column('varchar', { nullable: true })
  publisher: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
