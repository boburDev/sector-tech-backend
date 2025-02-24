import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Catalog, Subcatalog, Category } from '../../entities/catalog.entity';
import { IsNull } from 'typeorm';

const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);

// Catalog Controllers

export const getCatalogs = async (req: Request, res: Response): Promise<any> => {
    try {
        const catalogs = await catalogRepository.find({
            where: { deletedAt: IsNull() },
            relations: ["subcatalogs", "subcatalogs.categories"],
            select: {
                id: true,
                slug: true,
                title: true,
                subcatalogs: {
                    id: true,
                    title: true,
                    slug: true,
                    categories: {
                        id: true,
                        slug: true,
                        title: true,
                    }
                }
            }
        });

        if (catalogs.length === 0) {
            return res.status(404).json({ message: "Catalog not found" });
        }

        // Return the catalogs if found
        return res.status(200).json({data:catalogs});

    } catch (error) {
        console.error('Error fetching catalogs:', error);
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
                }
            },
            relations: ["catalog"]
        });

        if (!subcatalog) {
            return res.status(404).json({ message: "Subcatalog not found" });
        }

        return res.status(200).json(subcatalog);

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
            relations: ["subCatalog"]
        });


        if (categories.length === 0) {
            return res.status(404).json({ message: "categories not found" });
        }

        return res.status(200).json(categories);

    } catch (error) {
        // console.error('Error fetching subcatalog:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error
        });
    }
};
