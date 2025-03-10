import { Column, Entity, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./products.entity";

@Entity('garantee')
export class Garantee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    price: string;

    @Column()
    productId: string;

    @ManyToOne(() => Product, (product) => product.garantees)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

