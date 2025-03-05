import { Request, Response } from 'express';
import { CatalogFilter } from '../../entities/catalog_filter.entity';
import AppDataSource from '../../config/ormconfig';

const catalogFilterRepository = AppDataSource.getRepository(CatalogFilter);

export const getCatalogFilterById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const filter = await catalogFilterRepository
            .createQueryBuilder('filter')
            .leftJoinAndSelect('filter.subcatalog', 'subcatalog')
            .leftJoinAndSelect('filter.category', 'category')
            .where('filter.subcatalogId = :id OR filter.categoryId = :id', { id })
            .getOne();

        if (!filter) {
            return res.status(404).json({ message: "Catalog filter not found" });
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
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const createCatalogFilter = async (req: Request, res: Response): Promise<any> => {
    try {
        let { subcatalogId = null, categoryId = null, data = [] } = req.body;

        if (!subcatalogId && !categoryId) {
            return res.status(400).json({ message: "Either subcatalogId or categoryId must be provided." });
        }

        const existingFilter:any = await catalogFilterRepository.findOne({
            where: [{ categoryId }]
        });
        
        if (existingFilter) {
            const existingNames = new Set(existingFilter.data.map((item: any) => item.name));
            
            for (const item of data) {
                if (existingNames.has(item.name)) {
                    return res.status(400).json({ message: `You can't create the same element: ${item.name}` });
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
            return res.status(201).json(filterResult);
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
            return res.status(201).json(filterResult);
        }
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const updateCatalogFilter = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, data } = req.body;

        const filter: any = await catalogFilterRepository.findOneBy({ id });

        if (!filter) {
            return res.status(404).json({ message: "Catalog filter not found" });
        }

        const itemIndex = filter.data.findIndex((item: any) => item.name === name );

        if (itemIndex === -1) {
            return res.status(404).json({ message: `Item with name "${name}" not found in filter data` });
        }

        if(filter.data[itemIndex].name === data.name){
          return res.status(404) .json({message: `You can't update the same element: ${data.name}`});
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
        return res.status(200).json(filterResult);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const deleteCatalogFilter = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, deleteFilter = false } = req.body;

        const filter: any = await catalogFilterRepository.findOneBy({ id });

        if (!filter) {
            return res.status(404).json({ message: "Catalog filter not found" });
        }

        if (deleteFilter) {
            filter.deletedAt = new Date();
            await catalogFilterRepository.save(filter);
            return res.status(200).json({ message: "Catalog filter deleted successfully." });
        }

        if (!name) {
            return res.status(400).json({ message: "Name is required to delete a specific item." });
        }

        const itemIndex = filter.data.findIndex((item: any) => item.name === name);

        if (itemIndex === -1) {
            return res.status(404).json({ message: `Item with name "${name}" not found in filter data` });
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
        return res.status(200).json(filterResult);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
