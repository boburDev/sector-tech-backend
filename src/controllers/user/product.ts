import { Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Product } from "../../entities/products.entity";
import { IsNull, Not } from "typeorm";
import { Cart, SavedProduct } from "../../entities/user_details.entity";

const productRepository = AppDataSource.getRepository(Product);
const savedProductRepository = AppDataSource.getRepository(SavedProduct);
const cartProductRepository = AppDataSource.getRepository(Cart);

export const getProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const { recommended, condition, revalance, popular } = req.query;
    const whereCondition: any = { deletedAt: IsNull() };

    const conditionMapping: Record<string, string> = {
      new: "novyy",
      seller: "seller-rfb"
    };

    const revalanceMapping: Record<string, string> = {
      active: "aktualnoe",
      inactive: "snyato-s-proizvodstva-eos"
    };

    if (condition && conditionMapping[condition as string]) {
      whereCondition.conditions = { slug: conditionMapping[condition as string] };
    }

    if (revalance && revalanceMapping[revalance as string]) {
      whereCondition.relevances = { slug: revalanceMapping[revalance as string] };
    }

    if (recommended !== undefined) {
      whereCondition.recommended = JSON.parse(recommended as string);
    }

    const relations: string[] = [];
    if (popular !== undefined) {
      relations.push("popularProduct");
      whereCondition.popularProduct = {
        id: popular === "true" ? Not(IsNull()) : IsNull(),
      };
    }

    relations.push("category", "subcatalog", "catalog");

    const products = await productRepository.find({
      relations,
      where: whereCondition,
      order: { createdAt: "DESC" },
      select: {
        id: true,
        title: true,
        slug: true,
        articul: true,
        inStock: true,
        price: true,
        mainImage: true,
        recommended: true,
        catalog: {
          slug: true,
          title: true,
        },
        subcatalog: {
          slug: true,
          title: true,
        },
        category: {
          slug: true,
          title: true,
        },
        ...(condition && {
          conditions: { id: true, slug: true, title: true },
        }),
        ...(revalance && {
          relevances: { id: true, slug: true, title: true },
        }),
        ...(popular && {
          popularProduct: { id: true },
        }),
      },
    });

    return res.status(200).json({ data: products, error: null, status: 200 });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getProductById = async (req: Request,res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const product = await productRepository.findOne({
      relations: [
        "comments",
        "questions",
        "brand",
        "conditions",
        "relevances",
        "catalog",
        "subcatalog",
        "category"
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
          body: true,
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
        },
        catalog: {
          id: true,
          slug: true,
          title: true,
        },
        subcatalog: {
          id: true,
          slug: true,
          title: true,
        },
        category: {
          id: true,
          slug: true,
          title: true,
        }
      },
      where: {
        slug,
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
    return res.status(500).json({ message: "Internal server error", error });
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
      return res.status(200).json({ id:existingSaved.id, message: "Product removed from saved." });
    }

    const newSavedProduct = savedProductRepository.create({
      userId,
      productId,
    });

    await savedProductRepository.save(newSavedProduct);
    return res.status(201).json({ id:newSavedProduct.id, message: "Product saved successfully." });
  } catch (error) {
    console.error("Error in toggleSaved:", error);
    return res.status(500).json({ message: "Internal server error", error });
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
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const toggleCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId } = req.body;
    const { id: userId } = req.user;

    const existingCartItem = await cartProductRepository.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      await cartProductRepository.remove(existingCartItem);
      return res.status(200).json({ id:existingCartItem.id, message: "Product removed from cart." });
    }

    const newCartItem = cartProductRepository.create({
      userId,
      productId,
    });

    await cartProductRepository.save(newCartItem);
    return res.status(201).json({ id:newCartItem.id, message: "Product added to cart successfully." });
  } catch (error) {
    // console.error("Error in toggleCart:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getProductCarts = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.user;

    const userCart = await cartProductRepository.find({
      where: {
        userId: id,
      },
      order: { id: "DESC" },
      relations:["product","user"],
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

    if (userCart.length === 0) {
      return res.status(404).json({
        message: "No products found in the user's cart.",
      });
    }

    res.status(200).json({
      message: "Cart products retrieved successfully",
      data: userCart,
      error: null,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const searchProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title } = req.body;

    const products = await productRepository.find({
      where: { deletedAt: IsNull(), title }
    })

    if(products.length === 0){
      return res.status(404).json({ message:"Products not found", error:null, status: 404 })
    }

    return res.status(200).json({ data: products, error: null, status: 200 });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}