import { Request, Response } from 'express';
import fs from "fs";
import AppDataSource from '../config/ormconfig';
import { Product } from '../entities/products.entity';
import { ProductCondition, PopularProduct } from '../entities/product_details.entity';
import { IsNull } from 'typeorm';
import { productSchema } from '../validators/product.validator';

const productRepository = AppDataSource.getRepository(Product);

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
    const files = req.files as Express.Multer.File[] || [];

    try {
        const { error, value } = productSchema.validate(req.body);

        if (error) {
            files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });

            return res.status(400).json({ error: error.details.map(err => err.message) });
        }

        const product = new Product();
        product.title = value.title;
        product.articul = value.articul;
        product.productCode = value.productCode;
        product.characteristics = JSON.parse(value.characteristics);
        product.description = value.description;
        product.fullDescription = value.fullDescription;
        product.price = value.price;
        product.inStock = value.inStock;
        product.brandId = value.brandId;
        product.conditionId = value.conditionId;
        product.catalogId = value.catalogId;
        product.subcatalogId = value.subcatalogId;
        product.categoryId = value.categoryId;
        product.images = files.map(file => file.path.replace(/\\/g, "/"));
        
        let savedProduct = await productRepository.save(product);

        const sortedData = {
            title: savedProduct.title,
            articul: savedProduct.articul,
            price: savedProduct.price,
            image: savedProduct.images[0]
        };

        sortedData.image = sortedData.image.replace(/^public\//, "")

        res.json({ message: "Files received", data: sortedData });
    } catch (error) {
        console.error("Error creating product:", error);
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });

        return res.status(500).json({ error: "Internal server error" });
    }
};
