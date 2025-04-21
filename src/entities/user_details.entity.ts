import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { Users } from "./user.entity";
import { Product } from "./products.entity";

@Entity("saved_product")
export class SavedProduct {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    productId: string;

    @Column()
    userId: string;

    @ManyToOne(() => Product, (product) => product.saved_products)
    @JoinColumn({ name: "productId" })
    product: Product;

    @ManyToOne(() => Users, (user) => user.saved_products)
    @JoinColumn({ name: "userId" })
    user: Users;
}

@Entity("cart")
export class Cart {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    productId: string;

    @Column()
    userId: string;

    @ManyToOne(() => Product, (product) => product.saved_products)
    @JoinColumn({ name: "productId" })
    product: Product;

    @ManyToOne(() => Users, (user) => user.saved_products)
    @JoinColumn({ name: "userId" })
    user: Users;

    @Column({ type: "int", default: 1 })
    count: number;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
