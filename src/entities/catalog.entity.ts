import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { CatalogFilter } from "./catalog_filter.entity";

@Entity()
export class Catalog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    title: string;

    @OneToMany(() => Subcatalog, subcatalog => subcatalog.catalog)
    subcatalogs: Subcatalog[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

@Entity()
export class Subcatalog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 255 })
    title: string;

    @Column()
    catalogId: string;

    @ManyToOne(() => Catalog, catalog => catalog.subcatalogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'catalogId' })
    catalog: Catalog;

    @OneToMany(() => Category, category => category.subCatalog)
    categories: Category[];

    @OneToMany(() => CatalogFilter, filter => filter.subcatalog)
    filters: CatalogFilter[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 255 })
    title: string;

    @Column({ length: 500 })
    path: string;

    @Column()
    subCatalogId: string;

    @ManyToOne(() => Subcatalog, subcatalog => subcatalog.categories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'subCatalogId' })
    subCatalog: Subcatalog;

    @OneToMany(() => CatalogFilter, filter => filter.category)
    filters: CatalogFilter[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
