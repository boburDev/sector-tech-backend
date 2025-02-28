import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Product } from "./products.entity";
import { PopularBrand } from "./popular.entity";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 255, nullable: true })
    slug: string;

    @Column({ length: 500 })
    path: string;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];

    @OneToOne(() => PopularBrand, (popularBrand) => popularBrand.brand)
    popularBrand: PopularBrand;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}   
