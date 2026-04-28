import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("admins")
class Admin {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: "admin" })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: "general" })
    role: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Admin;
