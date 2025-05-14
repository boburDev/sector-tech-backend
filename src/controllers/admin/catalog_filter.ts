import { NextFunction, Request, Response } from 'express';
import { CatalogFilter } from '../../entities/catalog_filter.entity';
import AppDataSource from '../../config/ormconfig';
import { CustomError } from '../../error-handling/error-handling';
import { createSlug } from '../../utils/slug';
import { Product } from '../../entities/products.entity';
const STATIC_TITLE = ['Подкатегории', 'Состояние товара', 'Актуальность товара', 'Наличие в филиалах']
const catalogFilterRepository = AppDataSource.getRepository(CatalogFilter);
const productRepository = AppDataSource.getRepository(Product);
 
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

        const existingFilter: any = await catalogFilterRepository.findOne({
            where: [{
                subcatalogId: categoryId ? null : subcatalogId,
                categoryId,
            }]
        });

        const preparedData = prepareFilterData(data);

        if (existingFilter) {
            
            const existingNames = new Set(existingFilter.data.map((item: any) => item.name));

            for (const item of preparedData) {
                if (existingNames.has(item.name)) throw new CustomError(`You can't create the same element: ${item.title}`, 400);
            }

            existingFilter.data = [...existingFilter.data, ...preparedData];

            const result = await catalogFilterRepository.save(existingFilter);
            const cleanedData = result.data.map(cleanData);

            const filterResult = {
                message: "New filter updated successfully.",
                id: result.id,
                subcatalog: result.subcatalogId,
                category: result.categoryId,
                data: cleanedData,
            }
            return res.status(201).json(filterResult);
        } else {
            const newFilter = catalogFilterRepository.create({
                subcatalogId: categoryId ? null : subcatalogId,
                categoryId,
                data: preparedData
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
        next(error);
    }
};

export const updateCatalogFilter = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, data } = req.body;

        const filter: any = await catalogFilterRepository.findOneBy({ id });

        if (!filter) throw new CustomError('Catalog filter not found', 404);
        
        const itemIndex = filter.data.findIndex((item: any) => item.name === name);
        
        if (itemIndex === -1) throw new CustomError(`Item with name "${name}" not found in filter data`, 404);
        
        const itemNewIndex = filter.data.findIndex((item: any) => item.name === createSlug(data.title));
        if (itemNewIndex !== -1 && itemNewIndex !== itemIndex) throw new CustomError(`You can't update the same element: ${data.title}`, 404);
        
        const oldItem = filter.data[itemIndex];

        let updatedOptions = data.options;
        if (Array.isArray(data.options)) {
            updatedOptions = data.options.map((newOpt: any) => {
                const oldOpt = oldItem.options?.find((o: any) => o.name === newOpt.name);
                return {
                    ...newOpt,
                    name: createSlug(newOpt.title),
                    productsId: oldOpt?.productsId ?? []
                };
            });
        }

        const updatedItem = {
            ...oldItem, 
            name: createSlug(data.title),
            title: data.title,
            icon: data.icon,
            type: data.type,
            withSearch: data.withSearch,
            options: updatedOptions
        };

        filter.data[itemIndex] = updatedItem;

        const result = await catalogFilterRepository.save(filter);
        const cleanedData = result.data.map(cleanData);

        const filterResult = {
            message: "Catalog filter item updated successfully.",
            data: cleanedData,
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

export const addProductToFilter = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        let { productId = '', data = [], subcatalogId = null, categoryId = null } = req.body;

        const filter: any = await catalogFilterRepository.findOneBy({ id });
        if (!filter) throw new CustomError("Filter not found", 404);

        const product: any = await productRepository.findOneBy({ id: productId });
        if (!product) throw new CustomError("Product not found", 404);

        const filterData = filter.data;

        for (const filterItem of filterData) {
            const matchedInputItem = data.find((inputItem: any) => inputItem.name === filterItem.name);
            if (!matchedInputItem) continue;

            for (const option of filterItem.options) {
                const matchedOption = matchedInputItem.options.find(
                    (opt: any) => opt.name === option.name
                );

                if (matchedOption) {
                    if (!option.productsId?.includes(productId)) {
                        option.productsId?.push(productId);
                    }
                }
            }
        }

        const newFilters = mapFilterOptionsToString(data);
        await catalogFilterRepository.save(filter);

        const existingFilters = new Set(product.categoryFilter || []);
        newFilters.forEach(f => existingFilters.add(f));

        product.categoryFilter = Array.from(existingFilters);
        await productRepository.save(product);

        return res.status(200).json({
            message: "Successfully added",
            filterData: filter.data,
        });
    } catch (error) {
        next(error);
    }
};

function prepareFilterData(data: any[]): any[] {
    return data
        .filter((filter: any) => !STATIC_TITLE.includes(filter.title))
        .map((item) => {
            const newItem = { ...item };
            newItem.name = createSlug(newItem.title);

            const isBrandOrPrice = newItem.name === 'brend' || newItem.name === 'tsena';
            const isRadio = newItem.type === 'radio';
            
            if (isBrandOrPrice) {
                delete newItem.options;
                newItem.withSearch = false
            } else if (isRadio) {
                newItem.options = []
                newItem.withSearch = false
            } else if (Array.isArray(newItem.options)) {
                newItem.options = newItem.options.map((opt: any) => ({
                    ...opt,
                    name: createSlug(opt.title),
                    productsId: opt.productsId ?? []
                }));
            }

            return newItem;
        });
}

function cleanData(item: any): any {
    const result = { ...item };

    if (Array.isArray(item.options)) {
        result.options = item.options.map((opt: any) => {
            const { productsId, ...rest } = opt;
            return rest;
        });
    }

    return result;
}

type FilterOption = {
    name: string;
};

type FilterItem = {
    name: string;
    options: FilterOption[];
};

export function mapFilterOptionsToString(data: FilterItem[]): string[] {
    return data.flatMap(item =>
        item.options.map(option => `${item.name}$$${option.name}`)
    );
}