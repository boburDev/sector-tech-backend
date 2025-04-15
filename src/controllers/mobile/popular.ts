import { IsNull, Not } from "typeorm";
import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Category } from "../../entities/catalog.entity";
import { Brand } from "../../entities/brands.entity";
import { Product } from "../../entities/products.entity";
const categoryRepository = AppDataSource.getRepository(Category);
const brandRepository = AppDataSource.getRepository(Brand);

const productRepository = AppDataSource.getRepository(Product);

export const getPopular = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const whereCondition: any = {
            deletedAt: IsNull(),
            popularCategory: { id: Not(IsNull()) }
        };

        const categories = await categoryRepository.find({
            where: whereCondition,
            order: { updatedAt: "ASC" },
            relations: ["popularCategory"],
            take: 11,
            select: {
                id: true,
                title: true,
                path: true,
                slug: true,
                updatedAt: true,    
                popularCategory: {
                    id: true,
                }
            }
        });

        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const productCount = await productRepository.count({
                    where: {
                        categoryId: category.id,
                        deletedAt: IsNull()
                    }
                });

                return {
                    ...category,
                    productCount
                };
            })
        );

        const totalProductCount = await productRepository.count({
            where: {
                deletedAt: IsNull(),
            }
        });

        const brands = await brandRepository.find({
            where: { deletedAt: IsNull(), popularBrand: { id: Not(IsNull()) } },
            order: { updatedAt: "ASC" },
            relations: ["popularBrand"],
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                path: true,
                updatedAt: true,
                popularBrand: {
                    id: true,
                }
            }
        });

        return res.status(200).json({
            categories: categoriesWithCount,
            totalProductCount,
            brands,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};
