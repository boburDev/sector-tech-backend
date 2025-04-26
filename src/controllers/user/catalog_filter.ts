import { NextFunction, Request, Response } from 'express';
import { CatalogFilter } from '../../entities/catalog_filter.entity';
import AppDataSource from '../../config/ormconfig';
import { CustomError } from '../../error-handling/error-handling';
import { IsNull } from 'typeorm';
import { Category, Subcatalog } from '../../entities/catalog.entity';
import { Product } from '../../entities/products.entity';
import { mapFilterOptionsToString } from '../admin/catalog_filter';
const catalogFilterRepository = AppDataSource.getRepository(CatalogFilter);
const categoryRepository = AppDataSource.getRepository(Category);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);   
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

export const searchProductByCatalogFilter = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { subcatalogSlug, categorySlug, options } = req.query;
        let parsedOptions: any[] = [];

        try {
            if (options && typeof options === "string") {
                const jsonStr = options.replace(/^options=/, "").trim();
                const filterOptions = mapFilterOptionsToString(JSON.parse(jsonStr));
                parsedOptions = filterOptions;
                
            }
        } catch (err) {
            return res.status(400).json({ error: "Invalid options format", status: 400 });
        }


        const whereCondition: any = {
            deletedAt: IsNull()
        };

        if (categorySlug) {
            const category = await categoryRepository.findOne({
                where: { deletedAt: IsNull(), slug: categorySlug as string }
            })
            if (category) {
                whereCondition.categoryId = category.id;
            } else {
                return res.status(200).json({ data: [], error: "Category id not found", status: 200 });
            }
        } else if (subcatalogSlug) {
            const subcatalog = await subcatalogRepository.findOne({
                where: { deletedAt: IsNull(), slug: subcatalogSlug as string }
            })
            if (subcatalog) {
                whereCondition.subcatalogId = subcatalog.id;
            } else {
                return res.status(200).json({ data: [], error: "Subcatalog id not found", status: 200 });
            }
        } else {
            return res.status(200).json({ data: [], error: "Subcatalog id not found", status: 200 });
        }

        const products = await productRepository.find({
            where: whereCondition,
            relations: ['subcatalog', 'category'],
            select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                mainImage: true,
                productCode: true,
                createdAt: true,
                categoryFilter: true,
            }
        });
        
        const filteredProducts = products.filter((product) => {
            return parsedOptions.some((option) => {
                return categorySlug ? product.categoryFilter.includes(option) : product.subcatalogFilter.includes(option);
            });
        });

        const categoryFilter = await catalogFilterRepository.findOne({
            where: whereCondition,
            relations: ['subcatalog', 'category'],
            select: ['id', 'data']
        });

        const filteredProductsIds = filteredProducts.map((product) => product.id);

        let filteredCategoryFilter = [];

        filteredCategoryFilter = categoryFilter?.data?.map((item: any) => {
            const filteredOptions = item?.options?.map((option: any) => {
                const matchedProductIds = option?.productsId?.filter((productId: any) =>
                    filteredProductsIds.includes(productId)
                );
                const { productsId, ...rest } = option;
                return {
                    ...rest,
                    productCount: productsId ? matchedProductIds.length : 0
                };
            });

            return {
                ...item,
                options: filteredOptions
            };
        });

        return res.status(200).json({
            data: {
                filteredProducts,
                filteredCategoryFilter
            },
            error: null,
            status: 200
        });


    } catch (error) {
        next(error);
    }
}
