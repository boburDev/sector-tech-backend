import { Request, Response } from 'express';
import AppDataSource from '../config/ormconfig';
import { ProductCondition, ProductQuestion, ProductComment, PopularProduct, ProductRelevance } from '../entities/product_details.entity';
import { In, IsNull } from 'typeorm';
import { Product } from '../entities/products.entity';

const productRepository = AppDataSource.getRepository(Product);
const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const productRelevanceRepository = AppDataSource.getRepository(ProductRelevance);
const productQuestionRepository = AppDataSource.getRepository(ProductQuestion);
const productCommentRepository = AppDataSource.getRepository(ProductComment);
const popularProductRepository = AppDataSource.getRepository(PopularProduct);

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


