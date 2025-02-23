import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Catalog, Subcatalog, Category } from '../../entities/catalog.entity';
import { IsNull } from 'typeorm';

const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);

// Catalog Controllers
export const getCatalogById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const catalog = await catalogRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (!catalog) {
            return res.json({
                data: null,
                error: 'Catalog not found',
                status: 400
            });
        }

        const { createdAt, deletedAt, ...catalogData } = catalog;

        return res.json({
            data: catalogData,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllCatalogs = async (req: Request, res: Response): Promise<any> => {
    try {
        const catalogs = await catalogRepository
            .createQueryBuilder('catalog')
            .leftJoinAndSelect('catalog.subcatalogs', 'subcatalogs', 'subcatalogs.deletedAt IS NULL')
            .where('catalog.deletedAt IS NULL')
            .orderBy('catalog.createdAt', 'DESC')
            .getMany();

        const catalogsWithoutDates = catalogs.map(catalog => {
            const { createdAt, deletedAt, ...catalogData } = catalog;
            return catalogData;
        });

        return res.json({
            data: catalogsWithoutDates,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};



// Subcatalog Controllers
export const getSubcatalogWithCategoryByCatalogId = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        // First check if catalog exists
        const catalog = await catalogRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!catalog) {
            return res.json({
                data: null,
                error: 'Catalog not found',
                status: 404
            });
        }
        
        // Get subcatalogs with categories for this catalog
        const queryBuilder = subcatalogRepository.createQueryBuilder('subcatalog')
            .leftJoinAndSelect('subcatalog.categories', 'category', 'category.deletedAt IS NULL')
            .where('subcatalog.catalogId = :catalogId', { catalogId: id })
            .andWhere('subcatalog.deletedAt IS NULL')
            .orderBy('subcatalog.createdAt', 'DESC')
            .addOrderBy('category.createdAt', 'DESC');

        const subcatalogs = await queryBuilder.getMany();

        if (!subcatalogs.length) {
            return res.json({
                data: [],
                error: null,
                status: 200
            });
        }

        // Format response by removing timestamps
        const formattedSubcatalogs = subcatalogs.map(subcatalog => {
            const { createdAt, deletedAt, ...subcatalogData } = subcatalog;
            return {
                ...subcatalogData,
                categories: subcatalog.categories.map(category => {
                    const { createdAt, deletedAt, ...categoryData } = category;
                    return categoryData;
                })
            };
        });

        return res.json({
            data: formattedSubcatalogs,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSubcatalogById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const subcatalogs = await subcatalogRepository.find({
            where: {
                catalogId: id,
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (!subcatalogs.length) {
            return res.json({
                data: [],
                error: null,
                status: 200
            });
        }

        const formattedSubcatalogs = subcatalogs.map(subcatalog => {
            const { createdAt, deletedAt, ...subcatalogData } = subcatalog;
            return subcatalogData;
        });

        return res.json({
            data: formattedSubcatalogs,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// Category Controllers
export const getCategoriesBySubcatalogId = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        // First check if subcatalog exists
        const subcatalog = await subcatalogRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!subcatalog) {
            return res.json({
                data: null,
                error: 'Subcatalog not found',
                status: 404
            });
        }

        // Get categories for this subcatalog
        const categories = await categoryRepository.find({
            where: {
                subCatalogId: id,
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (!categories.length) {
            return res.json({
                data: [],
                error: null,
                status: 200
            });
        }

        // Format response by removing timestamps
        const formattedCategories = categories.map(category => {
            const { createdAt, deletedAt, ...categoryData } = category;
            categoryData.path = categoryData.path.replace(/^public\//, "")
            return categoryData;
        });

        return res.json({
            data: formattedCategories,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
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
        console.error('getAllCategories Error:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error
        });
    }
};