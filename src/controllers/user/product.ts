import { Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Product } from "../../entities/products.entity";
import { IsNull } from "typeorm";
import { ProductCondition, ProductRelevance } from "../../entities/product_details.entity";
import { SavedProduct } from "../../entities/user_details.entity";

const productRepository = AppDataSource.getRepository(Product);
const savedProductRepository = AppDataSource.getRepository(SavedProduct);

export const getProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const condition = req.query.condition === "true";
    const revalance = req.query.revalance === "true";

    const relation: string[] = [];
    
    if (condition) {
      relation.push("conditions");
    }

    // console.log('Revalance:', revalance);
    if (revalance) {
      relation.push("relevances");
    }

    const products = await productRepository.find({
      relations: relation,
      where: {
        deletedAt: IsNull(),
      },
      order: { createdAt: "DESC" },
      select: {
        id: true,
        title: true,
        slug: true,
        articul: true,
        inStock: true,
        price: true,
        mainImage: true,
        ...(condition && {
          conditions: {
            id: true,
            slug: true,
            title: true
          }
        }),
        ...(revalance && {
          relevances: {
            id: true,
            slug: true,
            title: true
          }
        })
      }
    });

    res.json({
      data: products,
      error: null,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req: Request,res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const product = await productRepository.findOne({
      relations: [
        "comments",
        "questions",
        "brand",
        "conditions",
        "relevances"
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        articul: true,
        productCode: true,
        description: true,
        inStock: true,
        price: true,
        mainImage: true,
        fullDescription: true,
        fullDescriptionImages: true,
        characteristics: true,
        images: true,
        comments: {
          id: true,
          commentBody: true,
          reply: true,
          star: true,
        },
        questions: {
          id: true,
          body: true,
          reply: true,
        },
        brand: {
          id: true,
          isPopular: true,
          path: true,
          title: true,
          slug: true,
        },
        conditions:{
          id: true,
          title: true,
          slug: true,
        },
        relevances: {
          id: true,
          title: true,
          slug: true
        }
      },
      where: {
        id,
        deletedAt: IsNull()
      }
    });


    if (!product) res.json({ data: "Not found ", error: null, status: 200 });

    res.json({
      data: product,
      error: null,
      status: 200,
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleSaved = async (req: Request,res: Response): Promise<any> => {
  try {
    const { productId } = req.body;
    const { id: userId } = req.user;

    const existingSaved = await savedProductRepository.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (existingSaved) {
      await savedProductRepository.remove(existingSaved);
      return res.status(200).json({ message: "Product removed from saved." });
    }

    const newSavedProduct = savedProductRepository.create({
      userId,
      productId,
    });

    await savedProductRepository.save(newSavedProduct);
    return res.status(201).json({ message: "Product saved successfully." });
  } catch (error) {
    console.error("Error in toggleSaved:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserSavedProducts = async (req: Request,res: Response): Promise<any> => {
  try {
    const { id } = req.user;

    const user = await savedProductRepository.find({
      where: {
        userId: id,
      },
      order: { id: "DESC" },
      select: {
        product: {
          id: true,
          mainImage: true,
          title: true,
          description: true,
          images: true,
          price: true,
          articul: true,
          slug: true,
        },
        user: {
          id: true,
          email: true,
          phone: true,
          name: true,
        },
      },
    });
    if (user.length === 0) {
      return res.status(404).json({
        message: "In this user no found saved products",
      });
    }

    res.status(200).json({message: "Saved products retrived successfully",
        data: user,
        error: null,
        status: 200
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
