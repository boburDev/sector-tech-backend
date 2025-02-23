import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Product } from "./products.entity";
import { Users } from "./user.entity";

@Entity()
export class ProductCondition {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.conditions)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity()
export class ProductRelevance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.relevances)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity()
export class ProductQuestion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  body: string;

  @Column()
  userId: string;

  @Column("jsonb", { default: [] })
  reply: {
    id: string;
    adminId: string;
    message: string;
    createdAt: Date;
  }[];

  @Column()
  productId: string;

  @ManyToOne(() => Users, (user) => user.questions)
  @JoinColumn({ name: "userId" })
  user: Users;

  @ManyToOne(() => Product, (products) => products.questions)
  @JoinColumn({ name: "productId" })
  products: Product;
  
}

@Entity()
export class ProductComment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  commentBody: string;

  @Column()
  star: number;

  @Column()
  productId: string;

  @Column("jsonb", { default: [] })
  reply: {
    id: string;
    adminId: string;
    message: string;
    createdAt: Date;
  }[];

  @Column()
  userId: string;

  @ManyToOne(() => Users, (user) => user.comments)
  @JoinColumn({ name: "userId" })
  user: Users;

  @ManyToOne(() => Product, (products) => products.comments)
  @JoinColumn({ name: "productId" })
  products: Product;
}

@Entity()
export class PopularProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.populars)
  @JoinColumn({ name: "productId" })
  products: Product;
}
