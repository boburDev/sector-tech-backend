import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class Promotion {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    path: string;

    @Column("timestamp")
    expireDate: Date;

    @Column()
    fullDescription: string;

    @Column("json", { nullable: true })
    fullDescriptionImages: string[];

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
