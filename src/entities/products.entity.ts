import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { Brand } from "./brands.entity";
import { PopularProduct, ProductComment, ProductCondition, ProductQuestion, ProductRelevance } from "./product_details.entity";
import { Catalog, Category, Subcatalog } from "./catalog.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    articul: string;

    @Column()
    productCode: string;

    @Column()
    description: string;

    @Column()
    inStock: string;

    @Column()
    fullDescription: string;

    @Column("json")
    characteristics: Record<string, any>;

    @Column()
    price: number;

    @Column("json", { nullable: true })
    images: string[];

    @Column()
    brandId: string;

    @Column()
    conditionId: string;

    @Column()
    catalogId: string;

    @Column()
    subcatalogId: string;

    @Column()
    categoryId: string;

    @Column()
    relevanceId: string;

    @ManyToOne(() => ProductRelevance, (relevance) => relevance.products)
    @JoinColumn({ name: 'relevanceId' })
    relevances: ProductRelevance;

    @ManyToOne(() => Catalog, (catalog) => catalog.products)
    @JoinColumn({ name: 'catalogId' })
    catalog: Catalog;

    @ManyToOne(() => Subcatalog, (subcatalog) => subcatalog.products)
    @JoinColumn({ name: 'subcatalogId' })
    subcatalog: Subcatalog;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn({ name: 'brandId' })
    brand: Brand;

    @ManyToOne(() => ProductCondition, (condition) => condition.products)
    @JoinColumn({ name: 'conditionId' })
    conditions: ProductCondition;

    @OneToMany(() => PopularProduct, (popular) => popular.products)
    populars: PopularProduct[];

    @OneToMany(() => ProductQuestion, (question) => question.products)
    questions: ProductQuestion[];

    @OneToMany(() => ProductComment, (comment) => comment.products)
    comments: ProductComment[];

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
