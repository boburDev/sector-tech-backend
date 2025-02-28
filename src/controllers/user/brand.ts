import { Request, Response } from 'express';
import {  IsNull } from 'typeorm';
import AppDataSource from '../../config/ormconfig';
import { Brand } from '../../entities/brands.entity';
const brandRepository = AppDataSource.getRepository(Brand);

export const getBrandById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const brand = await brandRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!brand) {
            return res.json({
                data: null,
                error: 'Brand not found',
                status: 404
            });
        }

        const { createdAt, deletedAt, ...brandData } = brand;
        brandData.path = brandData.path.replace(/^public\//, "")
        return res.json({
            data: brandData,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBrands = async (req: Request, res: Response): Promise<any> => {
    try {

        const whereCondition: any = {
            deletedAt: IsNull(),
        };

        const brands = await brandRepository.find({
            where: whereCondition,
            select: {
                id: true,
                title: true,
                path: true,
                slug: true,
            }
        });

        return res.status(200).json({data: brands, error: null, status: 200});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};