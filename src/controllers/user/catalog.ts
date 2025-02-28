import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Catalog, Subcatalog, Category } from '../../entities/catalog.entity';
import { IsNull } from 'typeorm';

const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);

// Catalog Controllers

interface CatalogSelect {
    id: boolean;
    slug: boolean;
    title: boolean;
    subcatalogs?: {
        id: boolean;
        title: boolean;
        slug: boolean;
        categories?: {
            id: boolean;
            slug: boolean;
            title: boolean;
        };
    };
}

export const getCatalogs = async (req: Request, res: Response): Promise<any> => {
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
        };

        if (isCategory || defaultCase) {
            relations.push("subcatalogs");
            select.subcatalogs = {
                id: true,
                title: true,
                slug: true,
            };
            relations.push("subcatalogs.categories");
            select.subcatalogs.categories = {
                id: true,
                slug: true,
                title: true,
            };
        }
        else if (isSubcatalog) {
            relations.push("subcatalogs");
            select.subcatalogs = {
                id: true,
                title: true,
                slug: true,
            };
        }
        else if (isCatalog && !isSubcatalog && !isCategory) {
        }

        const catalogs = await catalogRepository.find({
            where: { deletedAt: IsNull() },
            order: { createdAt: "DESC" },
            relations: relations.length > 0 ? relations : undefined,
            select,
        });

        if (catalogs.length === 0) {
            return res.status(404).json({ message: "Catalog not found" });
        }

        return res.status(200).json({ data: catalogs, error: null, status: 200  });
    } catch (error) {
        console.error("Error fetching catalogs:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getAllCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        const categories = await categoryRepository.find({
            where: {
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (categories.length === 0) {
            return res.json({
                data: [],
                error: null,
                status: 200
            });
        }

        const categoriesWithoutDates = categories.map(category => {
            const { createdAt, deletedAt, ...categoryData } = category;
            return categoryData;
        });

        return res.json({
            data: categoriesWithoutDates,
            error: null,
            status: 200
        });

    } catch (error) {
        // console.error('getAllCategories Error:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error
        });
    }
};

export const getSubCatalogByCatalogSlug = async (req: Request, res: Response): Promise<any> => {
    try {
        const { catalogSlug } = req.params;
        // console.log(catalogSlug);
        
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

        if (subcatalog.length === 0) {
            return res.status(404).json({ message: "Subcatalog not found" });
        }

        return res.status(200).json({ data: subcatalog, error: null, status: 200 });

    } catch (error) {
        // console.error('Error fetching subcatalog:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error
        });
    }
};

export const getCategoryBySubCatalogSlug = async (req: Request, res: Response): Promise<any> => {
    try {
        const { subCatalogSlug } = req.params;
        // console.log(subCatalogSlug);
        
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


        if (categories.length === 0) {
            return res.status(404).json({ message: "categories not found" });
        }

        return res.status(200).json({ data: categories, error: null, status: 200 });

    } catch (error) {
        // console.error('Error fetching subcatalog:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error
        });
    }
};
