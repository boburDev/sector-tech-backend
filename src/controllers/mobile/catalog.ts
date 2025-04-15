import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Catalog, Subcatalog, Category } from '../../entities/catalog.entity';
import { IsNull } from 'typeorm';
import { CatalogFilter } from '../../entities/catalog_filter.entity';
const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);
const catalogFilterRepository = AppDataSource.getRepository(CatalogFilter);

// Catalog Controllers

interface CatalogSelect {
    id: boolean;
    slug: boolean;
    title: boolean;
    updatedAt: boolean;
    subcatalogs?: {
        id: boolean;
        title: boolean;
        slug: boolean;
        updatedAt: boolean;
        categories?: {
            id: boolean;
            slug: boolean;
            title: boolean;
            updatedAt: boolean;
        };
    };
}

export const getCatalogs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { catalog, subcatalog, category } = req.query;

        const isCatalog = catalog === "true";
        const isSubcatalog = subcatalog === "true";
        const isCategory = category === "true";

        const defaultCase = !catalog && !subcatalog && !category;

        const relations: string[] = [];
        const select: CatalogSelect = {
            id: true,
            slug: true,
            title: true,
            updatedAt: true,
        };

        if (isCategory || defaultCase) {
            relations.push("subcatalogs");
            select.subcatalogs = {
                id: true,
                title: true,
                slug: true,
                updatedAt: true,
            };
            relations.push("subcatalogs.categories");
            select.subcatalogs.categories = {
                id: true,
                slug: true,
                title: true,
                updatedAt: true,
            };
        } else if (isSubcatalog) {
            relations.push("subcatalogs");
            select.subcatalogs = {
                id: true,
                title: true,
                slug: true,
                updatedAt: true,
            };
        }

        const catalogs = await catalogRepository.find({
            where: { deletedAt: IsNull() },
            relations: ["subcatalogs", "subcatalogs.categories"],
            select,
            order: {
                updatedAt: "ASC",
                subcatalogs: { updatedAt: "ASC", categories: { updatedAt: "ASC" } },
            },
        });

        return res.status(200).json({ data: catalogs, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const getSubCatalogByCatalogSlug = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { catalogSlug } = req.params;
        const subcatalog = await subcatalogRepository.find({
            where: {
                deletedAt: IsNull(),
                catalog: {
                    slug: catalogSlug
                },
            },
            order: { createdAt : "DESC" },
            relations: ["catalog"]
        });
        return res.status(200).json({ data: subcatalog, error: null, status: 200 });

    } catch (error) {
        next(error);
    }
};

export const getCategoryBySubCatalogSlug = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { subCatalogSlug } = req.params;
        const categories = await categoryRepository.find({
            where: {
                deletedAt: IsNull(),
                subCatalog: {
                    slug: subCatalogSlug
                }
            },
            order: { createdAt: "DESC" },
            relations: ["subCatalog"]
        });

        return res.status(200).json({ data: categories, error: null, status: 200 });

    } catch (error) {
        next(error);
    }
};

export const getFilterBySubcatalogCategorySlug = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { subcatalogSlug, categorySlug } = req.query;

        const whereCondition: any = {
            deletedAt: IsNull()
        };

        if (categorySlug) {
            const category = await categoryRepository.findOne({
                where: { deletedAt: IsNull(), slug: categorySlug as string }
            })
            if (category) {
                whereCondition.categoryId = category.id;
                whereCondition.subcatalogId = null;
            } else {
                return res.status(200).json({ data: [], error: null, status: 200 });
            }
        } else if (subcatalogSlug) {
            const subcatalog = await subcatalogRepository.findOne({
                where: { deletedAt: IsNull(), slug: subcatalogSlug as string }
            })
            if (subcatalog) {
                whereCondition.subcatalogId = subcatalog.id;
                whereCondition.categoryId = null;
            } else {
                return res.status(200).json({ data: [], error: null, status: 200 });
            }
        } else {
            return res.status(200).json({ data: [], error: null, status: 200 });
        }

        const categoryFilter = await catalogFilterRepository.findOne({
            where: whereCondition,
            relations: ['subcatalog', 'category'],
            select: ['id', 'data']
        });

        const updatedCategoryFilter = categoryFilter?.data.map((filters: any) => {
            const updatedOptions = filters.options?.map((option: any) => {
                const { productsId, ...rest } = option;
                return {
                    ...rest,
                    productCount: productsId?.length || 0,
                };
            });

            return {
                ...filters,
                options: updatedOptions,
            };
        });

        return res.status(200).json({ data: updatedCategoryFilter ? updatedCategoryFilter : [], error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};