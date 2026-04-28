import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @Column({ nullable: true })
  recipient_name?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  zipcode?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  complement?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }

    // Use APP_API_URL from environment, or construct from request if available
    const baseUrl = process.env.APP_API_URL || 'http://localhost:3333';
    return `${baseUrl}/files/${this.avatar}`;
  }
}

export default User;
