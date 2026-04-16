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
import OrdersProducts from './OrdersProducts';
import Customer from '@modules/customers/typeorm/entities/Customer';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Customer;

  @Column('uuid', { name: 'buyer_id', nullable: true })
  buyer_id: string;

  @Column('uuid', { array: true, name: 'seller_ids', nullable: true })
  seller_ids: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => OrdersProducts, order_products => order_products.order, {
    cascade: true,
  })
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
