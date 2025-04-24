import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, JoinColumn, ManyToOne, DeleteDateColumn } from "typeorm";
import { Product } from "./products.entity";
import { OrderStatus } from "../common/enums/order-status.enum";
import { Kontragent } from "./kontragent.entity";
import { KontragentAddress } from "./kontragent_addresses.entity";
import { Users } from "./user.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    agentId: string;

    @Column("uuid")
    contrAgentId: string;

    @Column("uuid")
    userId: string;

    @Column()
    city: string;

    @Column({ nullable: true })
    comment: string;

    @Column()
    deliveryMethod: string;

    @Column()
    email: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    fullname: string;

    @Column()
    phone: string;

    @Column("bigint")
    total: number;

    @Column({type: "enum", enum: OrderStatus, default: OrderStatus.PENDING})
    status: OrderStatus;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ nullable: true })
    deliveryDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Users, (user) => user.order)
    @JoinColumn({ name: "userId" })
    user: Users;

    @ManyToOne(() => Kontragent, (kontragent: Kontragent) => kontragent.order)
    @JoinColumn({ name: "contrAgentId" })
    contrAgent: Kontragent;

    @ManyToOne(() => KontragentAddress, (kontragentAddress: KontragentAddress) => kontragentAddress.order)
    @JoinColumn({ name: "agentId" })
    agent: KontragentAddress;

    @ManyToMany(() => Product, (product: Product) => product.order)
    @JoinTable({ name: "order_products" })
    products: Product[];
}
