import { Request, Response } from 'express';
import {  IsNull, Not } from 'typeorm';
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
        return res.json({
            data: brandData,
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
