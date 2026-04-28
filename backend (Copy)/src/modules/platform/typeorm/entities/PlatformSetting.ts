import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('platform_settings')
class PlatformSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 4 })
  tax_rate: number;

  @Column('decimal', { precision: 10, scale: 4 })
  profit_margin: number;

  @Column('decimal', { precision: 10, scale: 2 })
  packaging_cost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  shipping_cost: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default PlatformSetting;
