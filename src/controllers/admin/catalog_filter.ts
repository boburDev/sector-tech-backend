import { NextFunction, Request, Response } from 'express';
import { CatalogFilter } from '../../entities/catalog_filter.entity';
import AppDataSource from '../../config/ormconfig';
import { CustomError } from '../../error-handling/error-handling';
import { IsNull } from 'typeorm';
import { Not } from 'typeorm';
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

export const createCatalogFilter = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let { subcatalogId = null, categoryId = null, data = [] } = req.body;

        if (!subcatalogId && !categoryId) throw new CustomError('Either subcatalogId or categoryId must be provided.', 400);

        const existingFilter:any = await catalogFilterRepository.findOne({
            where: [{ categoryId }]
        });
        
        if (existingFilter) {
            const existingNames = new Set(existingFilter.data.map((item: any) => item.name));
            
            for (const item of data) {
                if (existingNames.has(item.name)) throw new CustomError(`You can't create the same element: ${item.name}`, 400);    
            }

            existingFilter.data = [...existingFilter.data, ...data];

            existingFilter.data = existingFilter.data.map((item: any) => ({
                ...item,
                productsId: item.productsId ?? []
            }));

            const result = await catalogFilterRepository.save(existingFilter); 
            result.data = result.data.map((item: any) => {
                const { productsId, ...rest } = item;
                return rest;
            });

            const filterResult = {
                message: "New filter updated successfully.",
                id: result.id,
                subcatalog: result.subcatalogId,
                category: result.categoryId,
                data: result.data,
            }
            return res.status(201).json(filterResult);
        } else {
            const updatedData = data.map((item: any) => ({
                ...item,
                productsId: item.productsId ?? []
            }));

            const newFilter = catalogFilterRepository.create({
                subcatalogId: categoryId ? null : subcatalogId,
                categoryId,
                data: updatedData
            });

            const result = await catalogFilterRepository.save(newFilter);
            result.data = result.data.map((item: any) => {
                const { productsId, ...rest } = item;
                return rest;
            });

            const filterResult = {
                message: "New filter created successfully.",
                id: result.id,
                subcatalog: result.subcatalogId,
                category: result.categoryId,
                data: result.data,
            }
            return res.status(201).json(filterResult);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateCatalogFilter = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, data } = req.body;

        const filter: any = await catalogFilterRepository.findOneBy({ id });

        if (!filter) throw new CustomError('Catalog filter not found', 404);

        const itemIndex = filter.data.findIndex((item: any) => item.name === name );

        if (itemIndex === -1) throw new CustomError(`Item with name "${name}" not found in filter data`, 404);

        // if(filter.data[itemIndex].name === data.name){
        //   throw new CustomError(`You can't update the same element: ${data.name}`, 404);
        // }
        filter.data[itemIndex] = {
            ...data,
            productsId: filter.data[itemIndex].productsId
        };
        
        const result = await catalogFilterRepository.save(filter);

        result.data = result.data.map((item: any) => {
            const { productsId, ...rest } = item;
            return rest;
        });

        const filterResult = {
            message: "Catalog filter item updated successfully.",
            data: result.data,
            subcatalog: result.subcatalogId,
            category: result.categoryId,
            id: result.id,
        }
        return res.status(200).json(filterResult);
    } catch (error) {
        next(error);
    }
};

export const deleteCatalogFilter = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, deleteFilter = false } = req.body;

        const filter: any = await catalogFilterRepository.findOneBy({ id });

        if (!filter) throw new CustomError('Catalog filter not found', 404);

        if (deleteFilter) {
            filter.deletedAt = new Date();
            await catalogFilterRepository.save(filter);
            return res.status(200).json({ message: "Catalog filter deleted successfully." });
        }

        if (!name) throw new CustomError('Name is required to delete a specific item.', 400);

        const itemIndex = filter.data.findIndex((item: any) => item.name === name);

        if (itemIndex === -1) throw new CustomError(`Item with name "${name}" not found in filter data`, 404);

        filter.data.splice(itemIndex, 1);

        const result = await catalogFilterRepository.save(filter);

        const filterResult = {
            message: "Catalog filter item deleted successfully.",
            id: result.id,
            subcatalog: result.subcatalogId,
            category: result.categoryId,
            data: result.data
        }
        return res.status(200).json(filterResult);
    } catch (error) {
        next(error);
    }
};

export const getTestFilterSubcatalogIdCategoryId = async ( req: Request, res: Response, next: NextFunction ): Promise<any> => {
    try {
        const { subcatalog } = req.query;
        let filter: any;

        if (subcatalog === "true") {
            filter = await catalogFilterRepository.find({
                where: {
                    subcatalogId: Not(IsNull()),
                    categoryId: IsNull(),
                    deletedAt: IsNull(),
                },
            });
        } else {
            filter = await catalogFilterRepository.find({
                where: {
                    categoryId: Not(IsNull()),
                    subcatalogId: IsNull(),
                    deletedAt: IsNull(),
                },
            });
        }

        return res.status(200).json({ data: filter, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};