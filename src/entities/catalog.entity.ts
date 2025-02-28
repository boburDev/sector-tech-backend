    import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CatalogFilter } from "./catalog_filter.entity";
import { Product } from "./products.entity";
import { PopularCategory } from "./popular.entity";


@Entity()
export class Catalog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 255, nullable: true })
    slug: string;

    @OneToMany(() => Subcatalog, subcatalog => subcatalog.catalog)
    subcatalogs: Subcatalog[];

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
 
@Entity()
export class Subcatalog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 255, nullable: true })
    slug: string;

    @Column()
    catalogId: string;

    @ManyToOne(() => Catalog, catalog => catalog.subcatalogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'catalogId' })
    catalog: Catalog;

    @OneToMany(() => Category, category => category.subCatalog)
    categories: Category[];

    @OneToMany(() => Product, product => product.category)
    products: Product[];

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

    @Column({ length: 255 })
    title: string;

    @Column({ length: 255, nullable: true })
    slug: string;

    @Column({ length: 500, default: null, nullable: true })
    path: string;

    @Column()
    subCatalogId: string;

    @ManyToOne(() => Subcatalog, subcatalog => subcatalog.categories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'subCatalogId' })
    subCatalog: Subcatalog;

    @OneToMany(() => CatalogFilter, filter => filter.category)
    filters: CatalogFilter[];

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @OneToOne(() => PopularCategory, popularCategory => popularCategory.category)
    popularCategory: PopularCategory;   

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
