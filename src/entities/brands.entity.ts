import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Product } from "./products.entity";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 255 })
    title: string;

    @Column({ length: 500 })
    path: string;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
