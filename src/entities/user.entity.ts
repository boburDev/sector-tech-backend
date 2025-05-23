import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, JoinColumn, ManyToOne } from "typeorm";
import { ProductQuestion, ProductComment } from "./product_details.entity";
import * as bcrypt from "bcrypt";
import { Cart, SavedProduct } from "./user_details.entity";
import { Kontragent } from "./kontragent.entity";
import { Order } from "./order.entity";
import { RequestEntity } from "./requests.entity";
@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, default: null })
  name?: string;

  @Column({ unique: true })
  email: string;  

  @Column({ type: "text", nullable: true, default: null })
  password?: string | null;

  @Column({ nullable: true, default: null })
  phone?: string;

  @OneToMany(() => ProductQuestion, (question) => question.user)
  questions: ProductQuestion[];

  @OneToMany(() => ProductComment, (comment) => comment.user)
  comments: ProductComment[];

  @OneToMany(() => SavedProduct, (savedProduct) => savedProduct.user)
  saved_products: SavedProduct[];

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany(() => Kontragent, (kontragent) => kontragent.user)
  contragents: Kontragent[];


  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  @OneToMany(() => RequestEntity, (request) => request.user)
  requests: RequestEntity[];



  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean | null> {
    return this.password ? bcrypt.compare(plainPassword, this.password) : null;
  }
}
