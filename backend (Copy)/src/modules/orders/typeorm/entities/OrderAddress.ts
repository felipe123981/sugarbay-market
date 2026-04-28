import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order_addresses')
class OrderAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column('text', { nullable: false })
  address: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: false })
  zip: string;

  @Column({ nullable: false })
  country: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrderAddress;
