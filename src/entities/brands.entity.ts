import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Product } from "./products.entity";

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

    @Column({ type:"boolean", default: false})
    isPopular: boolean;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
