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
import OrderAddress from './OrderAddress';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Customer;

  @Column('uuid', { name: 'buyer_id', nullable: false })
  buyer_id: string;

  @Column('uuid', { array: true, name: 'seller_ids', nullable: false })
  seller_ids: string[];

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  total: number;

  @Column('enum', { enum: ['Pending', 'Paid'], default: 'Pending', nullable: false })
  status: string;

  @Column('uuid', { name: 'shipping_address_id', nullable: false })
  shipping_address_id: string;

  @ManyToOne(() => OrderAddress, { cascade: true })
  @JoinColumn({ name: 'shipping_address_id' })
  shipping_address: OrderAddress;

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
