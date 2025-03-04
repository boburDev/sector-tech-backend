import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("opts")
export class Opt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  optCode: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
}
