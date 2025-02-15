import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Brand } from "./brands.entity";
import { PopularProduct, ProductComment, ProductCondition, ProductQuestion } from "./product_details.entity";

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
    fullDescription: string;

    @Column("json")
    characteristics: Record<string, any>;

    @Column()
    brandId: string;

    @Column()
    conditionId: string;

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
}
