import { NextFunction, Request, Response } from 'express';
import { ILike, In, IsNull, Not } from 'typeorm';
import AppDataSource from '../../config/ormconfig';
import { Brand } from '../../entities/brands.entity';
import { createSlug } from '../../utils/slug';
import listContents from '../../utils/readFolders';
import { deleteFile } from '../../middlewares/removeFiltePath';
import { PopularBrand } from '../../entities/popular.entity';
import { CustomError } from '../../error-handling/error-handling';
const brandRepository = AppDataSource.getRepository(Brand);
const popularBrandRepository = AppDataSource.getRepository(PopularBrand);


export const getBrandById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
                slug: true,
                description: true
            }
        });

        if (!brand) throw new CustomError('Brand not found', 404);

        return res.json({
            data: brand,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const createBrand = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { title, description } = req.body;
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
        brand.description = description || null;

        const savedBrand = await brandRepository.save(brand);
        
        const { createdAt, deletedAt, ...brandData } = savedBrand;

        return res.json({
            data: brandData,
            error: null,
            status: 201
        });
    } catch (error) {
        next(error);
    }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const file = req.file as Express.Multer.File;

        const brand = await brandRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!brand) throw new CustomError('Brand not found', 404);

        if (title !== brand.title) {
            const existingBrand = await brandRepository.findOne({
                where: {
                    title: ILike(title.toLowerCase()),
                    deletedAt: IsNull()
                }
            });

            if (existingBrand) throw new CustomError('Brand with this title already exists', 400);
        }

        if (file) {
            deleteFile(brand.path)
            const newPath = file.path.replace(/\\/g, "/").replace(/^public\//, "");
            brand.path = newPath;
        }

        brand.title = title;
        brand.slug = createSlug(title);
        brand.description = description || null;

        const updatedBrand = await brandRepository.save(brand);
        const { createdAt, deletedAt, ...brandData } = updatedBrand;
        return res.json({
            data: brandData,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const getBrandPath = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let path = await listContents('brands');
        if (!path) {
            return res.json({
                data: [],
                error: null,
                status: 200
            });
        }

        path = path.filter((item: any) => item.type === 'file').map((item: any) => ({
            name: 'brands/' + item.name,
            type: item.type
        }));

        return res.json({
            data: path,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
}

export const updateBrandPath = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { path } = req.body;
        const brand = await brandRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });
        if (!brand) throw new CustomError('Brand not found', 404);

        brand.path = path;
        await brandRepository.save(brand);
        return res.json({
            data: { message: 'Brand path updated successfully' },
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
}

export const deleteBrand = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const brand = await brandRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });
        if (!brand) throw new CustomError('Brand not found', 404);
        
        brand.deletedAt = new Date();
        await brandRepository.save(brand);
        return res.json({
            data: { message: 'Brand deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const getBrands = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { popular } = req.query;

        const queryBuilder = brandRepository.createQueryBuilder("brand")
            .leftJoinAndSelect("brand.popularBrand", "popularBrand")
            .where("brand.deletedAt IS NULL");

        if (popular === "true") {
            queryBuilder.andWhere("popularBrand.id IS NOT NULL").select(['brand.id', 'brand.title', 'brand.path', 'brand.slug', 'brand.description', 'popularBrand.id']);
        } else if (popular === "false") {
            queryBuilder.andWhere("popularBrand.id IS NULL").select(['brand.id', 'brand.title', 'brand.path', 'brand.slug', 'brand.description']);
        }

        const brands = await queryBuilder
            .orderBy("brand.createdAt", "DESC").select(['brand.id', 'brand.title', 'brand.path', 'brand.slug', 'brand.description', 'popularBrand.id'])
            .getMany()

        return res.status(200).json({ data: brands, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const togglePopularBrand = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let { brandIds } = req.body;

        if (!Array.isArray(brandIds)) {
            brandIds = [brandIds];
        }

        if (!brandIds || brandIds.length === 0) {
            return res.status(400).json({
                data: null,
                error: "brandIds is required",
                status: 400
            });
        }

        const existingPopularBrands = await popularBrandRepository.find({
            where: { brandId: In(brandIds) }
        });

        if (existingPopularBrands.length > 0) {
            await popularBrandRepository.delete({ brandId: In(brandIds) });
            return res.status(200).json({
                data: { message: 'Popular brand deleted successfully' },
                error: null,
                status: 200
            });
        }

        const newPopularBrands = popularBrandRepository.create(
            brandIds.map((brandId: string) => ({
                brandId: brandId,
                updatedAt: new Date()
            }))
        );

        await popularBrandRepository.save(newPopularBrands);

        return res.status(201).json({
            data: { message: 'Popular brands created successfully' },
            error: null,
            status: 201
        });

    } catch (error) {
        next(error);
    }
};

export const getPopularBrandById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
                brand: { id: true, title: true, path: true, slug: true, description: true }
            }
        });

        if (!popularBrand) throw new CustomError('Popular brand not found', 404);

        return res.status(200).json({ data: popularBrand, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};      

export const getPopularBrandByBrandId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
                    description: true
                }
            }
        });
        if (!popularBrand) throw new CustomError('Popular brand not found', 404);

        return res.status(200).json({ data: popularBrand, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const deletePopularBrand = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const popularBrand = await popularBrandRepository.findOne({
            where: {
                id: id,
                brand: { deletedAt: IsNull() }
            }
        });
        if (!popularBrand) throw new CustomError('Popular brand not found', 404);

        await popularBrandRepository.delete(id);    

        return res.json({
            data: { message: 'Popular brand deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};  