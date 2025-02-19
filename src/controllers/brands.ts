import { Request, Response } from 'express';
import { ILike, IsNull } from 'typeorm';
import AppDataSource from '../config/ormconfig';
import { Brand } from '../entities/brands.entity';
import fs from 'fs';
import { createSlug } from '../utils/slug';
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

export const getAllBrands = async (req: Request, res: Response): Promise<any> => {
    try {
        const brands = await brandRepository
            .createQueryBuilder('brand')
            .where('brand.deletedAt IS NULL')
            .orderBy('brand.createdAt', 'DESC')
            .getMany();

        const brandsWithoutDates = brands.map(brand => {
            const { createdAt, deletedAt, ...brandData } = brand;
            brandData.path = brandData.path.replace(/^public\//, "")
            return brandData;
        });

        return res.json({
            data: brandsWithoutDates,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createBrand = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title } = req.body;
        const file = req.file as Express.Multer.File;

        if (!title || !file) {
            return res.json({
                data: null, 
                error: 'Title and logo file are required',
                status: 400
            });
        }
        const lowerTitle = title.toLowerCase();
        const existingBrand = await brandRepository.findOne({
          where: {
            title: ILike(lowerTitle),
            deletedAt: IsNull(),
          },
        });

        if (existingBrand) {
            return res.json({
                data: null,
                error: 'Brand with this title already exists',
                status: 400
            });
        }
        const newPath = file.path.replace(/\\/g, "/");
        const brand = new Brand();
        brand.title = title;
        brand.slug = createSlug(title);
        brand.path = newPath;

        const savedBrand = await brandRepository.save(brand);
        
        const { createdAt, deletedAt, ...brandData } = savedBrand;

        brandData.path = brandData.path.replace(/^public\//, "")
        return res.json({
            data: brandData,
            error: null,
            status: 201
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateBrand = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const file = req.file as Express.Multer.File;

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

        if (title !== brand.title) {
            const lowerTitle = title.toLowerCase();

            const existingBrand = await brandRepository.findOne({
                where: {
                    title:ILike(lowerTitle),
                    deletedAt: IsNull()
                }
            });

            if (existingBrand) {
                return res.json({
                    data: null,
                    error: 'Brand with this title already exists',
                    status: 400
                });
            }
        }

        if (file) {
            // Delete old file if exists
            const oldPath = brand.path;
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            const newPath = file.path.replace(/\\/g, "/");
            brand.path = newPath;
        }

        brand.title = title;
        brand.slug = createSlug(title);

        const updatedBrand = await brandRepository.save(brand);

        const { createdAt, deletedAt, ...brandData } = updatedBrand;

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

export const deleteBrand = async (req: Request, res: Response): Promise<any> => {
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

        brand.deletedAt = new Date();
        await brandRepository.save(brand);

        return res.json({
            data: { message: 'Brand deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
