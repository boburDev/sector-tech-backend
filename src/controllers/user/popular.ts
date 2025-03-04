import { IsNull, Not } from "typeorm";
import { Request, Response } from "express";
import AppDataSource from "../../config/ormconfig";
import { Category } from "../../entities/catalog.entity";
import { Brand } from "../../entities/brands.entity";
const categoryRepository = AppDataSource.getRepository(Category);
const brandRepository = AppDataSource.getRepository(Brand);

export const getPopular = async (req: Request, res: Response): Promise<any> => {
    try {

        let whereCondition: any = { deletedAt: IsNull(), popularCategory: { id: Not(IsNull()) } };
        const categories = await categoryRepository.find({
            where: whereCondition,
            order: { updatedAt: "DESC" },
            relations: ["popularCategory"],
            select: {
                id: true,
                title: true,
                path: true,
                slug: true,
                popularCategory: {
                    id: true,
                }
            }
        });

        const brands = await brandRepository.find({
            where: { deletedAt: IsNull(), popularBrand: { id: Not(IsNull()) } },
            order: { updatedAt: "DESC" },
            relations: ["popularBrand"],
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                path: true,
                popularBrand: {
                    id: true,
                }
            }
        });

        return res.status(200).json({ categories, brands, error: null, status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};