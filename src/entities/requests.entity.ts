import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Users } from "./user.entity";
import { Order } from "./order.entity";

@Entity('requests')
export class RequestEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 255 })
  topicCategory: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: "varchar", default: null})
  requestNumber: string;

  @Column({ type: 'varchar', length: 255 })
  topic: string;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  orderNumber?: string;

  @Column({ type: "uuid", nullable: true })
  orderId?: string;

  @Column({ type: 'varchar', length: 255, default: 'new' })
  status: string;

  @Column({ type: 'jsonb', default: [] })
  messages: {
    message: string;
    userId?: string;
    adminId?: string;
    filePath?: string;
    createdAt: string;
  }[];

  @Column({ type: "boolean", default: false })
  watched: boolean

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.requests)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Order, (order) => order.requests)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
