import { Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Product, SavedProduct } from "../../entities/products.entity";
import { IsNull } from "typeorm";

const productRepository = AppDataSource.getRepository(Product);
const savedProductRepository = AppDataSource.getRepository(SavedProduct);

export const getProducts = async (req: Request,res: Response): Promise<any> => {
  try {
    const products = await productRepository.find({
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
      },
      where: {
        deletedAt: IsNull(),
      },
    });

    res.json({
      data: products,
      error: null,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req: Request,res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const product = await productRepository.findOne({
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
      },
      where: [
        { id, deletedAt: IsNull() },
        { slug: id, deletedAt: IsNull() },
      ],
    });

    if (!product) res.json({ data: "", error: null, status: 200 });

    res.json({
      data: product,
      error: null,
      status: 200,
    });

    if (!product) {
      return res.status(404).json({
        data: null,
        error: "Product not found",
        status: 404,
      });
    }

    res.json(product);
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
    const { productId } = req.params;

    const user = await savedProductRepository.find({
      where: {
        productId,
        userId: id,
      },
      select: {
        product: {
          id: true,
          mainImage: true,
          title: true,
          description: true,
          images: true,
          fullDescription: true,
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

    res
      .status(200)
      .json({
        message: "Saved products retrived successfully",
        data: user,
        error: null,
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
