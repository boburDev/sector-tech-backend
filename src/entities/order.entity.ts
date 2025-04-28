import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import { Users } from "./user.entity";
import { Admin } from "./admin.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    orderNumber: string;

    @Column("uuid", { nullable: true })
    agentId?: string;

    @Column("uuid")
    contrAgentId: string;

    @Column("uuid")
    userId: string;

    @Column({ type: "varchar"})
    city: string;

    @Column({ nullable: true })
    comment: string;

    @Column({ type: "varchar", default: "Самовывоз" })
    deliveryMethod: string;

    @Column({ type: "varchar"})
    email: string;

    @Column({ type: "varchar"})
    fullname: string;

    @Column({ type: "varchar"})
    phone: string;

    @Column("bigint")
    total: number;

    @Column({ type: "varchar"})
    orderType: string;
    
    @Column({ type: "varchar", nullable: true })
    kontragentName: string;

    @Column({ type: "varchar", default: "Не отгружен" })
    orderDeleveryType: string;

    @Column({ type: "varchar", default: "Не оплачен"})
    orderPriceStatus: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ default : () => 'CURRENT_TIMESTAMP' })
    validStartDate: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP + INTERVAL '3 days'" })
    validEndDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({ type: 'jsonb', nullable: true })
    products: {
        productId: string;
        count: number;
        price: number;
        garantee?: {
            id: string;
            title: string;
            price: string;
        };
    }[];

    @ManyToOne(() => Users, (user) => user.order)
    @JoinColumn({ name: "userId" })
    user: Users;

    @Column("uuid", { nullable: true })
    adminId: string;

    @ManyToOne(() => Admin)
    @JoinColumn({ name: "adminId" })
    admin: Admin;
}
