import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";
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

    @Column({ type: "varchar"})
    city: string;

    @Column({ nullable: true })
    comment: string;

    @Column({ type: "varchar", default: "Не отгружен"})
    orderDeleveryType: string;

    @Column({ type: "varchar"})
    email: string;

    @Column({ type: "varchar"})
    fullname: string;

    @Column({ type: "varchar"})
    phone: string;

    @Column("bigint")
    total: number;

    @Column({type: "varchar"})
    status: string;

    @Column({ type: "varchar"})
    orderType: string;

    @Column({ type: "varchar", default: "Не оплачен"})
    orderPriceStatus: string;

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
}
