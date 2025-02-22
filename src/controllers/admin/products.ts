import { Request, Response } from 'express';
import fs from "fs";

import AppDataSource from '../../config/ormconfig';
import { Product } from '../../entities/products.entity';
import { IsNull } from 'typeorm';
import { productSchema } from '../../validators/product.validator';
import { createSlug } from '../../utils/slug';

const productRepository = AppDataSource.getRepository(Product);

export const getProducts = async (req: Request, res: Response): Promise<any> => {
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
        status: 200
    });
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
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

    if (!product) res.json({ data: '', error: null, status: 200 })

  
    res.json({
        data: product,
        error: null,
        status: 200
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

       const images = files.map(file => file.path.replace(/\\/g, "/"));
        
        const product = new Product();
        product.title = value.title;
        product.slug = createSlug(value.title);
        product.articul = value.articul || product.articul;
        product.productCode = value.productCode;
        product.characteristics = JSON.parse(value.characteristics);
        product.description = value.description;
        product.fullDescription = value.fullDescription;
        product.price = value.price;
        product.inStock = value.inStock;
        product.brandId = value.brandId;
        product.conditionId = value.conditionId;
        product.relevanceId = value.relevanceId;
        product.catalogId = value.catalogId;
        product.subcatalogId = value.subcatalogId;
        product.categoryId = value.categoryId;
        product.images = images;
        product.mainImage = images[0]
        
        let savedProduct = await productRepository.save(product);
        
        const sortedData = {
            title: savedProduct.title,
            articul: savedProduct.articul,
            price: savedProduct.price,
            image: savedProduct.mainImage
        };

        sortedData.image = sortedData.image.replace(/^public\//, "")

        res.json({ message: "Product created", data: sortedData });
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




