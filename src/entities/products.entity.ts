import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn, OneToOne } from "typeorm";
import { Brand } from "./brands.entity";
import { ProductComment, ProductCondition, ProductQuestion, ProductRelevance } from "./product_details.entity";
import { Catalog, Category, Subcatalog } from "./catalog.entity";
import { Cart, SavedProduct } from "./user_details.entity";
import { PopularProduct } from "./popular.entity";
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

  @Column({ default: null, nullable: true })
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

  @Column("json", { default: null, nullable: true })
  fullDescriptionImages: string[];

  @Column({ type:"boolean", default: false})
  recommended: boolean;

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

  @Column("json", { default: []})
  garanteeIds: string[];

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

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];

  @OneToOne(() => PopularProduct, (popularProduct) => popularProduct.product)
  popularProduct: PopularProduct;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

