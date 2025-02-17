import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { Product } from "./products.entity";
import { User } from "./user.entity";

@Entity()
export class ProductCondition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    name: string;

    @OneToMany(() => Product, (product) => product.conditions)
    products: Product[];

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

@Entity()
export class ProductQuestion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    body: string;

    @Column()
    userId: string;

    @Column()
    productId: string;

    @ManyToOne(() => User, (user) => user.questions)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Product, (products) => products.questions)
    @JoinColumn({ name: 'productId' })
    products: Product;
}

@Entity()
export class ProductComment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    commentBody: string;

    @Column()
    star: number;

    @Column()
    productId: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Product, (products) => products.comments)
    @JoinColumn({ name: 'productId' })
    products: Product;
}

@Entity()
export class PopularProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productId: string;

    @ManyToOne(() => Product, (product) => product.populars)
    @JoinColumn({ name: 'productId' })
    products: Product;
}