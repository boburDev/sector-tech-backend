import { Column, Entity, PrimaryGeneratedColumn, DeleteDateColumn } from "typeorm";

@Entity('garantee')
export class Garantee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    price: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

