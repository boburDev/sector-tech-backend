import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";

@Entity()
export class Banner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("text", { array: true }) 
    imagesPath: string[];

    @Column()
    webPage: string;

    @Column()
    url: string;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
