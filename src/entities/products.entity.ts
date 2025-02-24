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
import { Brand } from "./brands.entity";
import {
  ProductComment,
  ProductCondition,
  ProductQuestion,
  ProductRelevance,
} from "./product_details.entity";
import { Catalog, Category, Subcatalog } from "./catalog.entity";
import { Users } from "./user.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  articul: string;

  @Column()
  productCode: string;

  @Column()
  description: string;

  @Column()
  inStock: string;

  @Column()
  fullDescription: string;

  @Column("json")
  characteristics: object[];

  @Column()
  price: number;

  @Column({ default: "" })
  mainImage: string;

  @Column("json", { nullable: true })
  images: string[];

  @Column("json", { nullable: true })
  fullDescriptionImages: string[];

  @Column()
  brandId: string;

  @Column()
  conditionId: string;

  @Column()
  catalogId: string;

  @Column()
  subcatalogId: string;

  @Column()
  categoryId: string;

  @Column()
  relevanceId: string;

  @ManyToOne(() => ProductRelevance, (relevance) => relevance.products)
  @JoinColumn({ name: "relevanceId" })
  relevances: ProductRelevance;

  @ManyToOne(() => Catalog, (catalog) => catalog.products)
  @JoinColumn({ name: "catalogId" })
  catalog: Catalog;

  @ManyToOne(() => Subcatalog, (subcatalog) => subcatalog.products)
  @JoinColumn({ name: "subcatalogId" })
  subcatalog: Subcatalog;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: "brandId" })
  brand: Brand;

  @ManyToOne(() => ProductCondition, (condition) => condition.products)
  @JoinColumn({ name: "conditionId" })
  conditions: ProductCondition;

  @OneToMany(() => ProductQuestion, (question) => question.products)
  questions: ProductQuestion[];

  @OneToMany(() => ProductComment, (comment) => comment.products)
  comments: ProductComment[];

  @OneToMany(() => SavedProduct, (saved_products) => saved_products.product)
  saved_products: SavedProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity("saved_product")
export class SavedProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  productId: string;

  @Column()
  userId: string;

  @ManyToOne(() => Product, (product) => product.saved_products)
  @JoinColumn({ name: "productId" })
  product: Product;

  @ManyToOne(() => Users, (user) => user.saved_products)
  @JoinColumn({ name: "userId" })
  user: Users;
}
