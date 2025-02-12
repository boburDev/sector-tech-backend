import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Subcatalog, Category } from "./catalog.entity";

@Entity()
export class CatalogFilter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    subcatalogId: string;

    @Column({ nullable: true })
    categoryId: string;

    @Column('jsonb', { nullable: true })
    data: Record<string, any>;

    @ManyToOne(() => Subcatalog, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'subcatalogId' })
    subcatalog: Subcatalog;

    @ManyToOne(() => Category, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
