import { Request, Response } from 'express';
import { validate as isUuid } from "uuid";

import AppDataSource from '../config/ormconfig';
import { ProductCondition, ProductQuestion, ProductComment, PopularProduct, ProductRelevance } from '../entities/product_details.entity';
import { In, IsNull } from 'typeorm';
import { Product } from '../entities/products.entity';

const productRepository = AppDataSource.getRepository(Product);
const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const productRelevanceRepository = AppDataSource.getRepository(ProductRelevance);
const popularProductRepository = AppDataSource.getRepository(PopularProduct);
const productQuestionRepository = AppDataSource.getRepository(ProductQuestion);
const productCommentRepository = AppDataSource.getRepository(ProductComment);

export const getAllProductConditions = async (req: Request, res: Response): Promise<any> => {
    try {
        const productConditions = await productConditionRepository.find({ relations: ['products'] });
        return res.json({
            data: productConditions,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductConditionById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const productCondition = await productConditionRepository.findOne({ where: { id } });
        return res.json({
            data: productCondition,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createProductCondition = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, name } = req.body;
        const newProductCondition = productConditionRepository.create({ title, name });
        await productConditionRepository.save(newProductCondition);
        
        return res.json({
            data: newProductCondition,
            error: null,
            status: 201
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductConditionByName = async (req: Request, res: Response): Promise<any> => {
    try {
        const conditionIds = req.params.name.split(',');

        const productConditions = await productConditionRepository.find({
            where: { id: In(conditionIds) },
            relations: ['products'],
        });

        const result = await Promise.all(
            productConditions.map(async (condition: any) => {
                const productCount = await productRepository.count({
                    where: { conditionId: condition.id },
                });

                return {
                    title: condition.title,
                    name: condition.name,
                    productCount,
                };
            })
        );

        return res.json({
            data: result,
            error: null,
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProductCondition = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, name } = req.body;

    try {
        const productCondition = await productConditionRepository.findOne({ where: { id } });
        if (!productCondition) {
            return res.status(404).json({ message: 'Product condition not found' });
        }

        productCondition.title = title;
        productCondition.name = name;
        await productConditionRepository.save(productCondition);
        return res.json({
            data: productCondition,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteProductCondition = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const productCondition = await productConditionRepository.findOne({ where: { id } });
        if (!productCondition) {
            return res.status(404).json({ message: 'Product condition not found' });
        }

        productCondition.deletedAt = new Date();
        await productConditionRepository.save(productCondition);
        return res.json({
            message: 'Product condition deleted successfully',
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const getAllProductRelavances = async (req: Request, res: Response): Promise<any> => {
    try {
        const productRelevances = await productRelevanceRepository.find({ relations: ['products'] });
        return res.json({
            data: productRelevances,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getProductRelavanceById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const productRelevance = await productRelevanceRepository.findOne({ where: { id } });
        return res.json({
            data: productRelevance,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createProductRelavance = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, name } = req.body;
        const newProductRelevance = productRelevanceRepository.create({ title, name });
        await productRelevanceRepository.save(newProductRelevance);
        return res.json({
            data: newProductRelevance,
            error: null,
            status: 201
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getProductRelavanceByName = async (req: Request, res: Response): Promise<any> => {
    try {
        const relevanceIds = req.params.name.split(',');
        const productRelevances = await productRelevanceRepository.find({
            where: { id: In(relevanceIds) },
            relations: ['products'],
        });
        
        const result = await Promise.all(
            productRelevances.map(async (relevance: any) => {
                const productCount = await productRepository.count({
                    where: { relevanceId: relevance.id },
                });

                return {
                    title: relevance.title,
                    name: relevance.name,
                    productCount,
                };
            })
        );

        return res.json({
            data: result,
            error: null,
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}   

export const updateProductRelavance = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, name } = req.body;

    try {
        const productRelevance = await productRelevanceRepository.findOne({ where: { id } });
        if (!productRelevance) {
            return res.status(404).json({ message: 'Product relevance not found' });
        }

        productRelevance.title = title;
        productRelevance.name = name;
        await productRelevanceRepository.save(productRelevance);
        return res.json({
            data: productRelevance,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteProductRelavance = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const productRelevance = await productRelevanceRepository.findOne({ where: { id } });
        if (!productRelevance) {
            return res.status(404).json({ message: 'Product relevance not found' });
        }

        productRelevance.deletedAt = new Date();    
        await productRelevanceRepository.save(productRelevance);    
        return res.json({
            message: 'Product relevance deleted successfully',
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// Popular product

export const addToPopularProduct = async (req: Request,res: Response): Promise<any> => {
    try {
        const { productId } = req.body;
        if (!isUuid(productId)) {
          return res.status(400).json({
            error: "Invalid productId format",
            status: 400,
          });
        }
        const product = await productRepository.findOne({ where: { id: productId } });
        if (!product) {
          return res.status(404).json({
            data: null,
            error: "Product not found",
            status: 404,
          });
        }
      
        const popularProduct = popularProductRepository.create({ productId });
      
        await popularProductRepository.save(popularProduct);
      
        return res.status(201).json({
          data: popularProduct,
          message: "Popular product created successfully",
          status: 201,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const findAllPopularProducts = async (req: Request,res: Response): Promise<any> => {
    try {
        const popularProducts = await popularProductRepository.find({
          relations: ["products"],
          select: {
            products: {
                id: true,
                title: true,
                slug: true,
                articul: true,
                productCode: true,
                description: true,
                inStock: true,
                price: true,
                mainImage:true
            },
          },
        });
      
        return res.status(200).json({
          data: popularProducts,
          status: 200,
        });
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const findOnePopularProduct = async (req: Request,res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        if (!isUuid(id)) {
          return res.status(400).json({
            error: "Invalid productId format",
            status: 400,
          });
        }
      
        const popularProduct = await popularProductRepository.findOne({
          where: { id },
          relations: ["products"],
        });
      
        if (!popularProduct) {
          return res.status(404).json({
            data: null,
            error: "Popular product not found",
            status: 404,
          });
        }
      
        return res.status(200).json({
          data: popularProduct,
          status: 200,
        });
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });

    }
};


export const updatePopularProduct = async ( req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { productId } = req.body;
        if (!isUuid(id) || !isUuid(productId)) {
          return res.status(400).json({
            error: "Invalid productId format",
            status: 400,
          });
        }
        const popularProduct = await popularProductRepository.findOne({
            where: { id },
        });

        if (!popularProduct) {
            return res.status(404).json({
            data: null,
            error: "Popular product not found",
            status: 404,
            });
        }
        const product = await productRepository.findOne({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({
            data: null,
            error: "Product not found",
            status: 404,
            });
        }

        popularProduct.productId = productId;
        await popularProductRepository.save(popularProduct);

        return res.status(200).json({
            data: popularProduct,
            message: "Popular product updated successfully",
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const deletePopularProduct = async (req: Request,res: Response): Promise<any> => {
    try {
        const { id } = req.params;
       if (!isUuid(id)) {
         return res.status(400).json({
           error: "Invalid productId format",
           status: 400,
         });
       }
        const popularProduct = await popularProductRepository.findOne({
          where: { id },
        });
      
        if (!popularProduct) {
          return res.status(404).json({
            data: null,
            error: "Popular product not found",
            status: 404,
          });
        }
      
        await popularProductRepository.remove(popularProduct);
      
        return res.status(200).json({
          message: "Popular product deleted successfully",
          status: 200,
        });
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
        
    }
};


// product Question Repository

