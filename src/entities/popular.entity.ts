import { JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm";
import { Column } from "typeorm";
import { Brand } from "./brands.entity";
import { Category } from "./catalog.entity";
import { Product } from "./products.entity";
@Entity()
export class PopularBrand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 0, type: "int" })
    order: number;

    @Column({ type: 'uuid' })
    brandId: string;

    @OneToOne(() => Brand, (brand) => brand.id)
    @JoinColumn({ name: 'brandId' })
    brand: Brand;
}

@Entity()
export class PopularCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    categoryId: string;
    
    @OneToOne(() => Category, (category) => category.id)
    @JoinColumn({ name: 'categoryId' })
    category: Category;
}


@Entity()
export class PopularProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ type: 'uuid' })
    productId: string;

    @OneToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: 'productId' })
    product: Product;
}
