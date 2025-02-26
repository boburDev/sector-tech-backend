import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

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
