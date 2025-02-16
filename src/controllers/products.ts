import { Request, Response } from 'express';
import AppDataSource from '../config/ormconfig';
import { Product } from '../entities/products.entity';
import { ProductCondition, PopularProduct } from '../entities/product_details.entity';
import { IsNull } from 'typeorm';

const productRepository = AppDataSource.getRepository(Product);
const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const popularProductRepository = AppDataSource.getRepository(PopularProduct);

export const getProducts = async (req: Request, res: Response): Promise<any> => {
    const products = await productRepository.find({
        where: {
            deletedAt: IsNull()
        }
    });

    res.json(products);
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const product = await productRepository.findOne({
        where: {
            id,
            deletedAt: IsNull()
        }
    });

    if (!product) {
        return res.status(404).json({
            data: null,
            error: 'Product not found',
            status: 404
        });
    }

    res.json(product);
};

export const createProduct = async (req: Request, res: Response): Promise<any> => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ error: "No files uploaded." });
    }

    res.json({ message: "Files received", files: req.files });
};
