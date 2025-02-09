import { Request, Response } from 'express';
import { IsNull } from 'typeorm';
import AppDataSource from '../config/ormconfig';
import { Brand } from '../entities/brands.entity';

const brandRepository = AppDataSource.getRepository(Brand);

export const getBrandById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const brand = await brandRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!brand) {
            res.json({
                data: null,
                error: 'Brand not found',
                status: 404
            });
            return;
        }

        const { createdAt, deletedAt, ...brandData } = brand;

        res.json({
            data: brandData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const getAllBrands = async (req: Request, res: Response) => {
    try {
        const brands = await brandRepository
            .createQueryBuilder('brand')
            .where('brand.deletedAt IS NULL')
            .orderBy('brand.createdAt', 'DESC')
            .getMany();

        const brandsWithoutDates = brands.map(brand => {
            const { createdAt, deletedAt, ...brandData } = brand;
            return brandData;
        });

        res.json({
            data: brandsWithoutDates,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const createBrand = async (req: Request, res: Response) => {
    try {
        const { title, path } = req.body;

        const existingBrand = await brandRepository.findOne({
            where: {
                title,
                deletedAt: IsNull()
            }
        });

        if (existingBrand) {
            res.json({
                data: null,
                error: 'Brand with this title already exists',
                status: 400
            });
            return;
        }

        const brand = new Brand();
        brand.title = title;
        brand.path = path;

        const savedBrand = await brandRepository.save(brand);

        const { createdAt, deletedAt, ...brandData } = savedBrand;

        res.json({
            data: brandData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const updateBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, path } = req.body;

        const brand = await brandRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!brand) {
            res.json({
                data: null,
                error: 'Brand not found',
                status: 404
            });
            return;
        }

        if (title !== brand.title) {
            const existingBrand = await brandRepository.findOne({
                where: {
                    title,
                    deletedAt: IsNull()
                }
            });

            if (existingBrand) {
                res.json({
                    data: null,
                    error: 'Brand with this title already exists',
                    status: 400
                });
                return;
            }
        }

        brand.title = title;
        brand.path = path;

        const updatedBrand = await brandRepository.save(brand);

        const { createdAt, deletedAt, ...brandData } = updatedBrand;

        res.json({
            data: brandData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const deleteBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const brand = await brandRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!brand) {
            res.json({
                data: null,
                error: 'Brand not found',
                status: 404
            });
            return;
        }

        await brandRepository.softDelete(id);

        res.json({
            data: { message: 'Brand deleted successfully' },
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};
