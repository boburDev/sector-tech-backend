import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Product } from "../../entities/products.entity";
import { ILike, IsNull, MoreThan, Not } from "typeorm";
import { Cart, SavedProduct } from "../../entities/user_details.entity";
import { CustomError } from "../../error-handling/error-handling";
import { getSafeStock } from "../../utils/get-safe-stock";

const productRepository = AppDataSource.getRepository(Product);
const savedProductRepository = AppDataSource.getRepository(SavedProduct);
const cartProductRepository = AppDataSource.getRepository(Cart);

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
        garanteeIds: true,
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
    next(error);
  }
};

export const getProductById = async (req: Request,res: Response, next: NextFunction): Promise<any> => {
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
        garanteeIds: true,
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


    if (!product) throw new CustomError('Product not found', 404);

    return res.status(200).json({ data: product, error: null, status: 200 });

  } catch (error) {
    next(error);
  }
};

export const toggleSaved = async (req: Request,res: Response, next: NextFunction): Promise<any> => {
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
    next(error);
  }
};

export const getUserSavedProducts = async (req: Request,res: Response, next: NextFunction ): Promise<any> => {
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

    return res.status(200).json({message: "Saved products retrived successfully",
        data: user,
        error: null,
        status: 200
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCart = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
    next(error);
  }
};

export const getProductCarts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.user;

    const userCart = await cartProductRepository.find({
      where: { userId: id },
      order: { id: 'DESC' },
      relations: ['product'],
      select: {
        product: {
          id: true,
          title: true,
          slug: true,
          price: true,
          mainImage: true,
          articul: true,
          garanteeIds: true,
          images: true
        },
      },
    });

    const formattedCart = userCart.map((item) => ({
      count: item.count,
      ...item.product,
    }));

    return res.status(200).json({
      message: 'Cart products retrieved successfully',
      data: formattedCart,
      error: null,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCatalogSubcatalogCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { slug, categorySlug, page, limit, inStock, title, popular, price, name, productCode } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const filter: any = { deletedAt: IsNull() };
    const order: any = {};

    // 🔍 Katalog yoki subkatalog aniqlash
    if (typeof slug === "string") {
      const numericPrefix = parseInt(slug.split('.')[0]); 

      if (!isNaN(numericPrefix)) {
        if (numericPrefix < 100) {
          filter.catalog = { slug: slug as string, deletedAt: IsNull() };
        } else if (numericPrefix >= 100 && numericPrefix < 1000) {
          filter.subcatalog = { slug: slug as string, deletedAt: IsNull() };
        }
      }
    }

    if (categorySlug) {
      filter.category = { slug: categorySlug as string, deletedAt: IsNull() };
    }

    if (productCode) {
      filter.productCode = ILike(`%${productCode}%`);
    }

    if (inStock === "true") {
      filter.inStock = MoreThan(0);
    } else if (inStock === "false") {
      filter.inStock = "Под заказ";
    } else if (!isNaN(parseInt(inStock as string))) {
      filter.inStock = parseInt(inStock as string);
    }

    if (title) {
      filter.title = ILike(`%${title}%`);
    }

    if (popular === "true") {
      order.createdAt = "DESC";
    } else if (popular === "false") {
      order.createdAt = "ASC";
    }

    if (price === "asc") {
      order.price = "ASC";
    } else if (price === "desc") {
      order.price = "DESC";
    }

    if (name === "asc") {
      order.title = "ASC";
    } else if (name === "desc") {
      order.title = "DESC";
    }

    const [products, total] = await Promise.all([
      productRepository.find({
        where: filter,
        skip: offset,
        take: limitNumber,
        relations: ["category", "relevances", "conditions", "catalog", "subcatalog"],
        order,
        select: {
          id: true,
          title: true,
          slug: true,
          articul: true,
          inStock: true,
          price: true,
          mainImage: true,
          productCode: true,
          category: { slug: true },
          catalog: { slug: true },
          subcatalog: { slug: true },
          createdAt: true,
          relevances: {
            id: true,
            slug: true,
            title: true,
          },
          conditions: {
            id: true,
            title: true,
            slug: true,
          },
        },
      }),
      productRepository.count({ where: filter }),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      data: { products, total, pageNumber, limitNumber, totalPages },
      error: null,
      status: 200
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCartByUserId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.user;
    await cartProductRepository.delete({ userId: id });
    const cart = await cartProductRepository.find({ where: { userId: id } });
    if (cart.length > 0) {
      return res.status(400).json({ message: "Cart already deleted", error: null, status: 400 });
    }
    return res.status(200).json({ message: "Cart deleted successfully", error: null, status: 200 });
  } catch (error) {
    next(error);
  }
}

export const deleteSavedByUserId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.user;
    await savedProductRepository.delete({ userId: id });
    const saved = await savedProductRepository.find({ where: { userId: id } });
    if (saved.length > 0) {
      return res.status(400).json({ message: "Saved already deleted", error: null, status: 400 });
    }
    return res.status(200).json({ message: "Saved deleted successfully", error: null, status: 200 });
  } catch (error) {
    next(error);
  }
}

export const updateOrAddAmountToCart = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { productId, count } = req.body;
    const { id: userId } = req.user;
    const action = req.query.action as string;

    if (!productId || typeof count !== 'number' || count < 1) {
      return res.status(400).json({ message: 'Invalid input', status: 400 });
    }

    const cartItem = await cartProductRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      return res.status(404).json({
        message: 'This product is not in the cart',
        status: 404,
      });
    }

    const product = await productRepository.findOne({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found', status: 404 });
    }

    const stock = getSafeStock(product.inStock);
    let newTotal = cartItem.count;

    if (action === 'increment') {
      newTotal += count;

      if (newTotal > stock) {
        return res.status(400).json({
          message: `Only ${stock - cartItem.count} products are available in stock`,
          status: 400,
        });
      }
    } else if (action === 'decrement') {
      newTotal -= count;

      if (newTotal < 1) {
        newTotal = 1;
      }
    } else {
      return res.status(400).json({
        message: 'Invalid action value. Only "increment" or "decrement" is allowed.',
        status: 400,
      });
    }

    cartItem.count = newTotal;
    const updated = await cartProductRepository.save(cartItem);

    return res.status(200).json({
      message: 'Cart updated successfully',
      data: updated,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};