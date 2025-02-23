import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  ManyToOne,
} from "typeorm";
import { ProductQuestion, ProductComment } from "./product_details.entity";
import * as bcrypt from "bcrypt";
import { SavedProduct } from "./products.entity";

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  phone?: string;

  @OneToMany(() => ProductQuestion, (question) => question.user)
  questions: ProductQuestion[];

  @OneToMany(() => ProductComment, (comment) => comment.user)
  comments: ProductComment[];

  @OneToMany(() => SavedProduct, (savedProduct) => savedProduct.user)
  saved_products: SavedProduct[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
