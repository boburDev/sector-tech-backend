import { NextFunction, Request, Response } from 'express';
import {  IsNull } from 'typeorm';
import AppDataSource from '../../config/ormconfig';
import { Brand } from '../../entities/brands.entity';
import { CustomError } from '../../error-handling/error-handling';
const brandRepository = AppDataSource.getRepository(Brand);

export const getBrandById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { slug } = req.params;
        const brand = await brandRepository.findOne({
            where: {
                slug,
                deletedAt: IsNull()
            }
        });

        if (!brand) throw new CustomError('Brand not found', 404);

        const { createdAt, deletedAt, ...brandData } = brand;
        return res.json({
            data: brandData,
            error: null,
            status: 200
        });
    } catch (error: unknown) {
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
            queryBuilder.andWhere("popularBrand.id IS NOT NULL").select(['brand.id', 'brand.title', 'brand.path', 'brand.slug', 'popularBrand.id']); 
        } else if (popular === "false") {
            queryBuilder.andWhere("popularBrand.id IS NULL").select(['brand.id', 'brand.title', 'brand.path', 'brand.slug']);  
        }

        const brands = await queryBuilder
            .orderBy("brand.createdAt", "DESC").select(['brand.id', 'brand.title', 'brand.path', 'brand.slug', 'popularBrand.id'])
            .getMany()

        return res.status(200).json({ data: brands, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};
