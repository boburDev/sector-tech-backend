import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../common/enums/order-status.enum";

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", unique: true })
    orderId: string;

    @Column()
    userId: string;

    @Column()
    productId: string;

    @Column("decimal")
    total: number;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
