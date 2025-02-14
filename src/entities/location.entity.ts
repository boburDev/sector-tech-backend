import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Country {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 255, unique: true })
    name: string;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => Region, (region) => region.country)
    regions: Region[];
}

@Entity()
export class Region {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column()
    countryId: string;

    @ManyToOne(() => Country, (country) => country.regions, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: 'countryId' })
    country: Country;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
