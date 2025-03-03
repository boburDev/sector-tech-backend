import { Request, Response } from 'express';
import { ILike, In, IsNull, Not } from 'typeorm';
import AppDataSource from '../../config/ormconfig';
import { Brand } from '../../entities/brands.entity';
import { createSlug } from '../../utils/slug';
import { deleteFile } from '../../middlewares/removeFiltePath';
import { PopularBrand } from '../../entities/popular.entity';
const brandRepository = AppDataSource.getRepository(Brand);
const popularBrandRepository = AppDataSource.getRepository(PopularBrand);


export const getBrandById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const brand = await brandRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            },
            select: {
                id: true,
                path: true,
                title: true,
                slug: true
            }
        });

        if (!brand) {
            return res.json({
                data: null,
                error: 'Brand not found',
                status: 404
            });
        }

        return res.json({
            data: brand,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
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

        const existingBrand = await brandRepository.findOne({
          where: {
            title: ILike(title.toLowerCase()),
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
        const newPath = file.path.replace(/\\/g, "/").replace(/^public\//, "");

        const brand = new Brand();
        brand.title = title;
        brand.slug = createSlug(title);
        brand.path = newPath;

        const savedBrand = await brandRepository.save(brand);
        
        const { createdAt, deletedAt, ...brandData } = savedBrand;

        return res.json({
            data: brandData,
            error: null,
            status: 201
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
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
            const existingBrand = await brandRepository.findOne({
                where: {
                    title: ILike(title.toLowerCase()),
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
            deleteFile(brand.path)
            const newPath = file.path.replace(/\\/g, "/").replace(/^public\//, "");
            brand.path = newPath;
        }

        brand.title = title;
        brand.slug = createSlug(title);

        const updatedBrand = await brandRepository.save(brand);
        const { createdAt, deletedAt, ...brandData } = updatedBrand;
        return res.json({
            data: brandData,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
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
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getBrands = async (req: Request, res: Response): Promise<any> => {
    try {
        const { popular } = req.query;

        const queryBuilder = brandRepository.createQueryBuilder("brand")
            .leftJoinAndSelect("brand.popularBrand", "popularBrand")
            .where("brand.deletedAt IS NULL");

        if (popular === "true") {
            queryBuilder.andWhere("popularBrand.id IS NOT NULL").select(['brand.id', 'brand.title', 'brand.path', 'brand.slug', 'popularBrand.id']);
        } else if (popular === "false") {
            queryBuilder.andWhere("popularBrand.id IS NULL").select(['brand.id', 'brand.title', 'brand.path', 'brand.slug']);
        }

        const brands = await queryBuilder
            .orderBy("brand.createdAt", "DESC").select(['brand.id', 'brand.title', 'brand.path', 'brand.slug', 'popularBrand.id'])
            .getMany()

        return res.status(200).json({ data: brands, error: null, status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const createPopularBrand = async (req: Request, res: Response): Promise<any> => {
    try {
        let { brandIds } = req.body;

        if (!Array.isArray(brandIds)) {
            brandIds = [brandIds];
        }

        if (!brandIds || brandIds.length === 0) {
            return res.status(400).json({
                data: null,
                error: 'Invalid or empty brandIds',
                status: 400
            });
        }

        const existingPopularBrands = await popularBrandRepository.find({
            where: {
                brand: In(brandIds)
            }
        });

        if (existingPopularBrands.length > 0) {
            return res.status(400).json({
                data: null,
                error: 'Popular brands already exist',
                status: 400
            });
        }

        const lastPopularBrand = await popularBrandRepository.find({
            order: { updatedAt: 'DESC' }, 
            take: 1
        });

        const newPopularBrands = brandIds.map((brandId: string) => ({
            brand: { id: brandId },
            updatedAt: new Date()
        }));

        await popularBrandRepository.save(newPopularBrands);

        return res.status(201).json({
            data: newPopularBrands,
            error: null
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getPopularBrandById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const popularBrand = await popularBrandRepository.findOne({
            where: {
                id: id,
                brand: { deletedAt: IsNull() }
            },
            relations: ['brand'],
            select: {
                id: true,
                brand: { id: true, title: true, path: true, slug: true }
            }
        });

        if (!popularBrand) {
            return res.status(404).json({
                data: null,
                error: 'Popular brand not found',
                status: 404
            });     
        }   
        return res.status(200).json({ data: popularBrand, error: null, status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};      

export const getPopularBrandByBrandId = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const popularBrand = await popularBrandRepository.findOne({
            where: {
                brand: { id },
            },
            relations: ['brand'],
            select: {
                id: true,
                brand: {
                    id: true,
                    title: true,
                    path: true,
                    slug: true,
                }
            }
        });
        if (!popularBrand) {
            return res.json({
                data: null,
                error: 'Popular brand not found',
                status: 404
            }); 
        }       
        return res.status(200).json({ data: popularBrand, error: null, status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const deletePopularBrand = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const popularBrand = await popularBrandRepository.findOne({
            where: {
                id: id,
                brand: { deletedAt: IsNull() }
            }
        });
        if (!popularBrand) {
            return res.json({
                data: null,
                error: 'Popular brand not found',
                status: 404
            });
        }

        await popularBrandRepository.delete(id);

        return res.json({
            data: { message: 'Popular brand deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};  