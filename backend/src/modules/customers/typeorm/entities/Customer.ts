import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  shop_name?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'int', default: 0 })
  rating?: number;

  @Column({ type: 'int', default: 0 })
  reviews_count?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Customer;
