import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, DeleteDateColumn } from "typeorm";
import * as bcrypt from "bcrypt";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: 'admin' })
    role: string;

    @Column({ default: 'active' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;


    @DeleteDateColumn()
    deletedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
