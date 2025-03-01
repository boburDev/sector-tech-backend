import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Banner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column() 
    imagePath: string;

    @Column()
    redirectUrl: string;

    @Column()
    routePath: string;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
