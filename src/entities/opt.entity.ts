import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("opts")
export class Opt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  optCode: string;

  @CreateDateColumn()
  createdAt: Date;
}
