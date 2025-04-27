import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from "typeorm";
@Entity("news")
export class News {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column("text")
  fullDescription: string;

  @Column({ type: "varchar", nullable: true })
  fullDescriptionImages?: string[];

  @Column()
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
