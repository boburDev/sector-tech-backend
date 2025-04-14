import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { Users } from "./user.entity";
import { KontragentAddress } from "./kontragent_addresses.entity";

@Entity()
export class Kontragent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    ownershipForm: string;

    @Column({ type: "varchar", length: 50, nullable: true , unique: true})
    inn: string;

    @Column({ type: "varchar", length: 50, nullable: true , unique: true})
    pinfl: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    oked: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    countryOfRegistration: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "text" })
    legalAddress: string;

    @Column({ default: false })
    isFavorite: boolean;

    @Column()
    userId: string;

    @ManyToOne(() => Users, (user) => user.contragents)
    @JoinColumn({ name: "userId" })
    user: Users;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => KontragentAddress, (address) => address.kontragent)
    address: KontragentAddress[];   
}
