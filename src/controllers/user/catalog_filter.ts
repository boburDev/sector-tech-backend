import { NextFunction, Request, Response } from 'express';
import { CatalogFilter } from '../../entities/catalog_filter.entity';
import AppDataSource from '../../config/ormconfig';
import { CustomError } from '../../error-handling/error-handling';
const catalogFilterRepository = AppDataSource.getRepository(CatalogFilter);

export const getCatalogFilterById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;

        const filter = await catalogFilterRepository
            .createQueryBuilder('filter')
            .leftJoinAndSelect('filter.subcatalog', 'subcatalog')
            .leftJoinAndSelect('filter.category', 'category')
            .where('filter.subcatalogId = :id OR filter.categoryId = :id', { id })
            .getOne();

        if (!filter) throw new CustomError('Catalog filter not found', 404);

        filter.data = filter.data.map((item: any) => {
            const { productsId, ...rest } = item;
            return rest;
        });
        const result = {
            message: "Catalog filter retrieved successfully.",
            id: filter.id,
            subcatalog: filter.subcatalogId,
            category: filter.categoryId,
            data: filter.data,
        }
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
