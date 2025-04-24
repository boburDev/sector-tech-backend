import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Kontragent } from "./kontragent.entity";
import { Order } from "./order.entity";

@Entity("kontragent_address")
export class KontragentAddress {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    kontragentId: string;

    @Column({ type: "text" })
    fullAddress: string;

    @Column()
    country: string;

    @Column()
    region: string;

    @Column({ nullable: true })
    district: string;

    @Column({ nullable: true })
    street: string;

    @Column({ nullable: true })
    house: string;

    @Column({ nullable: true })
    apartment: string;

    @Column({ nullable: true })
    index: string;

    @Column({ type: "text", nullable: true })
    comment: string;

    @Column({ default: false })
    isMain: boolean;

    @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @ManyToOne(() => Kontragent, (kontragent: Kontragent) => kontragent.address)
    @JoinColumn({ name: "kontragentId" })
    kontragent: Kontragent;

    @OneToMany(() => Order, (order) => order.agent)
    order: Order[];
}   
