import { Request, Response } from 'express';
import { CatalogFilter } from '../entities/catalog_filter.entity';
import AppDataSource from '../config/ormconfig';

const catalogFilterRepository = AppDataSource.getRepository(CatalogFilter);

export const getCatalogFilterById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const filter = await catalogFilterRepository
            .createQueryBuilder('filter')
            .leftJoinAndSelect('filter.subcatalog', 'subcatalog')
            .leftJoinAndSelect('filter.category', 'category')
            .where('filter.subcatalogId = :id OR filter.categoryId = :id', { id })
            .getOne();

        if (!filter) {
            res.status(404).json({ message: "Catalog filter not found" });
            return;
        }

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
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error fetching catalog filter", error });
        return;
    }
};

export const createCatalogFilter = async (req: Request, res: Response) => {
    try {
        let { subcatalogId = null, categoryId = null, data = [] } = req.body;

        if (!subcatalogId && !categoryId) {
            res.status(400).json({ message: "Either subcatalogId or categoryId must be provided." });
            return;
        }

        const existingFilter:any = await catalogFilterRepository.findOne({
            where: [{ subcatalogId }, { categoryId }]
        });
        
        if (existingFilter) {
            const existingNames = new Set(existingFilter.data.map((item: any) => item.name));
            
            for (const item of data) {
                if (existingNames.has(item.name)) {
                    res.status(400).json({ message: `You can't create the same element: ${item.name}` });
                    return;
                }
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
            res.status(201).json(filterResult);
            return;
        } else {
            const updatedData = data.map((item: any) => ({
                ...item,
                productsId: item.productsId ?? []
            }));

            const newFilter = catalogFilterRepository.create({
                subcatalogId,
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
            res.status(201).json(filterResult);
            return;
        }
    } catch (error) {
        res.status(500).json({ message: "Error creating catalog filter", error });
        return;
    }
};

export const updateCatalogFilter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, data } = req.body;

        const filter: any = await catalogFilterRepository.findOneBy({ id });

        if (!filter) {
            res.status(404).json({ message: "Catalog filter not found" });
            return;
        }

        const itemIndex = filter.data.findIndex((item: any) => item.name === name);

        if (itemIndex === -1) {
            res.status(404).json({ message: `Item with name "${name}" not found in filter data` });
            return;
        }
        
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
        res.status(200).json(filterResult);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error updating catalog filter", error });
        return;
    }
};

export const deleteCatalogFilter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, deleteFilter = false } = req.body;

        const filter: any = await catalogFilterRepository.findOneBy({ id });

        if (!filter) {
            res.status(404).json({ message: "Catalog filter not found" });
            return;
        }

        if (deleteFilter) {
            await catalogFilterRepository.remove(filter);
            res.status(200).json({ message: "Catalog filter deleted successfully." });
            return;
        }

        if (!name) {
            res.status(400).json({ message: "Name is required to delete a specific item." });
            return;
        }

        const itemIndex = filter.data.findIndex((item: any) => item.name === name);

        if (itemIndex === -1) {
            res.status(404).json({ message: `Item with name "${name}" not found in filter data` });
            return;
        }

        filter.data.splice(itemIndex, 1);

        const result = await catalogFilterRepository.save(filter);

        const filterResult = {
            message: "Catalog filter item deleted successfully.",
            id: result.id,
            subcatalog: result.subcatalogId,
            category: result.categoryId,
            data: result.data
        }
        res.status(200).json(filterResult);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error deleting catalog filter", error });
        return;
    }
};

