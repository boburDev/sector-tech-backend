import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { Catalog, Subcatalog, Category } from "./catalog.entity";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 255 })
    title: string;

    @Column({ length: 500 })
    path: string;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
