import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Product } from "../../entities/products.entity";
import { ILike, In, IsNull, Like, MoreThan, Not } from "typeorm";
import { Cart, SavedProduct } from "../../entities/user_details.entity";
import { CustomError } from "../../error-handling/error-handling";
import { Garantee } from "../../entities/garantee.entity";

const productRepository = AppDataSource.getRepository(Product);
const savedProductRepository = AppDataSource.getRepository(SavedProduct);
const cartProductRepository = AppDataSource.getRepository(Cart);
const garanteRepository = AppDataSource.getRepository(Garantee);

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { recommended, condition, revalance, popular, limit = 12 } = req.query;
    if (typeof limit != 'number') throw new CustomError('Limit must be number', 400);
    
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

    relations.push("category", "subcatalog", "catalog", "conditions", "relevances");

    const products = await productRepository.find({
      relations,
      where: whereCondition,
      order: { createdAt: "DESC" },
      take: limit,
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
        createdAt: true,
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
        "category",
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
        garanteeIds: true,
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
        conditions: {
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
    const formattedProduct = {
      ...product,
      garanteeIds: JSON.parse(product?.garanteeIds as unknown as string)
    }

    if (!product) throw new CustomError('Product not found', 404);

    return res.status(200).json({ data: formattedProduct, error: null, status: 200 });

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

export const getUserSavedProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.user;

    const savedProducts = await savedProductRepository.find({
      where: {
        userId: id,
      },
      relations: ['product', 'product.catalog', 'product.subcatalog', 'product.category', 'product.relevances', 'product.conditions', 'product.brand'],
      order: { id: "DESC" },
      select: {
        id: true,
        product: {
          id: true,
          title: true,
          slug: true,
          price: true,
          mainImage: true,
          articul: true,
          garanteeIds: true,
          productCode: true,
          inStock: true,
          description: true,
          createdAt: true,
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
          },  
          relevances: {
            id: true,
            slug: true,
            title: true,
          },
          conditions: {
            id: true,
            slug: true,
            title: true,
          },
          brand: {
            id: true,
            slug: true,
            title: true,
          },  
        },
      },
    });
    const formattedSaved = savedProducts.map((item) => ({
      ...item.product,
      savedId: item.id,
    }));

    return res.status(200).json({
      message: "Saved products retrived successfully",
      data: formattedSaved,
      error: null,
      status: 200
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
      filter.productCode = Like(`%${productCode}%`);
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

export const getProductCarts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.user;

    const userCart = await cartProductRepository.find({
      where: { userId: id },
      order: { id: 'DESC' },
      relations: ['product', 'product.catalog', 'product.subcatalog', 'product.category', 'product.relevances', 'product.conditions', 'product.brand'],
      select: {
        id: true,
        count: true,
        product: {
          id: true,
          title: true,
          slug: true,
          price: true,
          mainImage: true,
          articul: true,
          garanteeIds: true,
          productCode: true,
          inStock: true,
          description: true,
          createdAt: true,
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
          },
          relevances: {
            id: true,
            slug: true,
            title: true,
          },
          conditions: {
            id: true,
            slug: true,
            title: true,
          },
          brand: {
            id: true,
            slug: true,
            title: true,
          },
        }
      },
    });

    const allGaranteeIds = userCart.flatMap((item) => {
      const raw = item.product.garanteeIds;
      if (Array.isArray(raw)) return raw;
      try {
        const parsed = JSON.parse(raw || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        return [];
      }
    });

    const uniqueIds = [...new Set(allGaranteeIds)];
    const allGarantees = uniqueIds.length
      ? await garanteRepository.find({ where: { id: In(uniqueIds) }, select: ['title', 'price', 'id'] })
      : [];

    const formattedCart = userCart.map((item) => {
      const garanteeIdArray = Array.isArray(item.product.garanteeIds)
        ? item.product.garanteeIds
        : (() => {
          try {
            const parsed = JSON.parse(item.product.garanteeIds || '[]');
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            return [];
          }
        })();

      const productGarantees = garanteeIdArray.map((id: string) =>
        allGarantees.find((g) => g.id === id)
      ).filter(Boolean);

      return {
        count: item.count,
        ...item.product,
        cartId: item.id,
        garantees: productGarantees.filter((garantee) => garantee?.price && Number(garantee?.price) > 0).map((garantee) => ({
          id: garantee?.id || '',
          title: garantee?.title || '',
          price: garantee?.price || 0,
        })),
      };
    });

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

export const toggleCart = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { productId } = req.body;
    const { id: userId } = req.user;
    const { count } = req.query;
    
    const existingCartItem = await cartProductRepository.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      await cartProductRepository.remove(existingCartItem);
      return res.status(200).json({ id: existingCartItem.id, message: "Product removed from cart." });
    }

    const newCartItem = cartProductRepository.create({
      userId,
      productId,
      count: count ? parseInt(count as string) : 1,
    });

    await cartProductRepository.save(newCartItem);
    return res.status(201).json({ id: newCartItem.id, message: "Product added to cart successfully." });
  } catch (error) {
    // console.error("Error in toggleCart:", error);
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
    if(saved.length > 0) {
      return res.status(400).json({ message: "Saved already deleted", error: null, status: 400 });
    }
    return res.status(200).json({ message: "Saved deleted successfully", error: null, status: 200 });
  } catch (error) {
    next(error);
  }
}

export const updateOrAddAmountToCart = async ( req: Request, res: Response,next: NextFunction ): Promise<any> => {
  try {
    const { productId, count } = req.body;
    const { id: userId } = req.user;

    if (!productId || typeof count !== 'number' || count < 1) {
      throw new CustomError('Invalid input', 400);
    }

    const cartItem = await cartProductRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new CustomError('This product is not in the cart', 404);
    }

    cartItem.count = count;
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

export const getSearchProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { search, page, limit, inStock, popular, price, name } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 12;
    const offset = (pageNumber - 1) * limitNumber;

    const isProductCode = /^\d+$/.test(search as string);
    const order: any = {};
    let whereCondition: any;

    if (popular === "true") order.createdAt = "DESC";
    else if (popular === "false") order.createdAt = "ASC";

    if (price === "asc") order.price = "ASC";
    else if (price === "desc") order.price = "DESC";

    if (name === "asc") order.title = "ASC";
    else if (name === "desc") order.title = "DESC";

    if (isProductCode) {
      whereCondition = [
        { productCode: ILike(`%${search}%`), deletedAt: IsNull() },
      ];
    } else {
      whereCondition = [
        { title: ILike(`%${search}%`), deletedAt: IsNull() },
        { description: ILike(`%${search}%`), deletedAt: IsNull() },
        { articul: ILike(`%${search}%`), deletedAt: IsNull() }
      ];
    }

    if (inStock && Array.isArray(whereCondition)) {
      let stockFilter: any;
      if (inStock === "true") stockFilter = MoreThan(0);
      else if (inStock === "false") stockFilter = "Под заказ";
      else if (!isNaN(parseInt(inStock as string))) stockFilter = parseInt(inStock as string);

      whereCondition = whereCondition.map((cond) => ({
        ...cond,
        inStock: stockFilter,
      }));
    }

    const products = await productRepository.find({
      where: whereCondition,
      order,
      skip: offset,
      take: limitNumber,
      relations: ['category', 'catalog',"subcatalog"],
      select: { 
        id: true,
        title: true,
        articul: true,
        productCode: true,
        inStock: true,
        slug: true,
        price: true,
        description: true,
        createdAt: true,
        mainImage:true,
        category: { id: true, slug: true, title: true },
        catalog: { id: true, slug: true, title: true },
        subcatalog: { id: true, slug: true, title: true },
      },
    });

    let similarProducts: any[] = [];

    if (products.length <= 50) {
      if (products.length === 1) {
        const mainProduct = products[0];
        similarProducts = await productRepository.find({
          where: {
            category: { id: mainProduct.category.id },
            id: Not(mainProduct.id),
            deletedAt: IsNull()
          },
          take: 100,
          relations: ['category', 'catalog',"subcatalog"],
          order: order,
          select: {
            id: true,
            title: true,
            articul: true,
            productCode: true,
            inStock: true,
            slug: true,
            price: true,
            description: true,
            createdAt: true,
            mainImage:true,
            category: { id: true, slug: true, title: true },
            catalog: { id: true, slug: true, title: true },
            subcatalog: { id: true, slug: true, title: true },
          },
        });
      } else if (products.length >= 5 && products.length <= 10) {
        for (const product of products) {
          const similars = await productRepository.find({
            where: {
              category: { id: product.category.id },
              id: Not(product.id),
              deletedAt: IsNull()
            },
            take: 10,
             relations: ['category', 'catalog',"subcatalog"],
            order: order,
            select: {
              id: true,
              title: true,
              articul: true,
              productCode: true,
              inStock: true,
              slug: true,
              price: true,
              description: true,
              createdAt: true,
              mainImage:true,
              category: { id: true, slug: true, title: true },
              catalog: { id: true, slug: true, title: true },
              subcatalog: { id: true, slug: true, title: true },
            },
          });
          similarProducts.push(...similars);
          if (similarProducts.length >= 100) break;
        }
      } else if (products.length > 10 && products.length <= 20) {
        for (const product of products) {
          const similars = await productRepository.find({
            where: {
              category: { id: product.category.id },
              id: Not(product.id),
              deletedAt: IsNull(),
            },
            take: 10,
            relations: ['category', 'catalog',"subcatalog"],
            order: order,
            select: {
              id: true,
              title: true,
              articul: true,
              productCode: true,
              inStock: true,
              slug: true,
              price: true,
              description: true,
              createdAt: true,
              mainImage:true,
              category: { id: true, slug: true, title: true },
              catalog: { id: true, slug: true, title: true },
              subcatalog: { id: true, slug: true, title: true },
            },
          });
          similarProducts.push(...similars);
          if (similarProducts.length >= 200) break;
        }
      } else if (products.length > 20) {
        const categoryIds = [...new Set(products.map(p => p.category.id))];
        similarProducts = await productRepository.find({
          where: {
            category: { id: In(categoryIds) },
            deletedAt: IsNull()
          },
          take: 300,
          relations: ['category', 'catalog',"subcatalog"],
          order: order,
          select: {
            id: true,
            title: true,
            articul: true,
            productCode: true,
            inStock: true,
            slug: true,
            price: true,
            description: true,
            createdAt: true,
            mainImage:true,
            category: { id: true, slug: true, title: true },
            catalog: { id: true, slug: true, title: true },
            subcatalog: { id: true, slug: true, title: true },
          },
        });
      }
    }

    const mergedProducts = [...products, ...similarProducts];

    // duplicate productCodes'larni olib tashlaymiz
    const productCodeSet = new Set<string>();
    const uniqueMergedProducts = mergedProducts.filter(product => {
      if (productCodeSet.has(product.productCode)) {
        return false;
      }
      productCodeSet.add(product.productCode);
      return true;
    });

    // total va pagination uchun uniqueMergedProducts ishlatamiz
    const totalProducts = uniqueMergedProducts.length;
    const paginatedProducts = uniqueMergedProducts.slice(offset, offset + limitNumber);

    // GroupedByCatalog hosil qilish
// Yangi structure bilan grouping
    const catalogMap = new Map();

    uniqueMergedProducts.forEach((product) => {
      const { catalog, subcatalog, category, productCode } = product;
      if (!catalog || !subcatalog || !category) return;

      if (!catalogMap.has(catalog.title)) {
        catalogMap.set(catalog.title, {
          catalogName: catalog.title,
          catalogSlug: catalog.slug,
          productCodes: [],
          subcatalogs: new Map()
        });
      }

    const catalogGroup = catalogMap.get(catalog.title);
    catalogGroup.productCodes.push(productCode);

    if (!catalogGroup.subcatalogs.has(subcatalog.title)) {
    catalogGroup.subcatalogs.set(subcatalog.title, {
      subcatalogName: subcatalog.title,
      subcatalogSlug: subcatalog.slug,
      categories: new Map()
      });
    }

    const subcatalogGroup = catalogGroup.subcatalogs.get(subcatalog.title);

    if (!subcatalogGroup.categories.has(category.title)) {
    subcatalogGroup.categories.set(category.title, {
      categoryName: category.title,
      categorySlug: category.slug,
      productCodes: []
    });
  }

    const categoryGroup = subcatalogGroup.categories.get(category.title);
    categoryGroup.productCodes.push(productCode);
  });

  // Final array conversion
    const groupedByCatalog = Array.from(catalogMap.values()).map(catalog => ({
      catalogName: catalog.catalogName,
      catalogSlug: catalog.catalogSlug,
      productCodes: catalog.productCodes,
      subcatalogs: Array.from(catalog.subcatalogs.values()).map((sub: any) => ({
        subcatalogName: sub.subcatalogName,
        subcatalogSlug: sub.subcatalogSlug,
        categories: Array.from(sub.categories.values()).map((cat: any) => ({
          categoryName: cat.categoryName,
          categorySlug: cat.categorySlug,
          productCodes: cat.productCodes
        }))
      }))
    }));


    // Yuboriladigan natija
    return res.status(200).json({
      data: {
        products: paginatedProducts,
        similarProducts,
        total: totalProducts,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
        groupedByCatalog,
      },
      error: null,
      status: 200,
    });
    
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSearchProductsByCodes = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { subcatalogSlug, categorySlug } = req.params;
    let { search } = req.query;
    
    if (!search) {
      throw new CustomError("search[] query param is required", 400);
    }

    if (typeof search === "string") {
      search = [search];
    }
    
    const productCodes = Array.isArray(search) ? search : Object.values(search);
    console.log(productCodes);
    const products = await productRepository.find({
      where: {
        productCode: In(productCodes),
        deletedAt: IsNull(),
      },
      relations: ['catalog', 'subcatalog', 'category'],
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        productCode: true,
        inStock: true,
        mainImage: true,
        catalog: { slug: true, title: true },
        subcatalog: { slug: true, title: true },
        category: { slug: true, title: true }
      },
    });
    
  
    return res.status(200).json({
      status: 200,
      message: "Products by codes retrieved",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
