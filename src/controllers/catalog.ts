import { Request, Response } from 'express';
import AppDataSource from '../config/ormconfig';
import { Catalog, Subcatalog, Category } from '../entities/catalog.entity';
import { IsNull } from 'typeorm';

const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);

// Catalog Controllers
export const getCatalogById = async (req: Request, res: Response) => {
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
            res.json({
                data: null,
                error: 'Catalog not found',
                status: 400
            });
            return;
        }

        const { createdAt, deletedAt, ...catalogData } = catalog;

        res.json({
            data: catalogData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const getAllCatalogs = async (req: Request, res: Response) => {
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

        res.json({
            data: catalogsWithoutDates,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const createCatalog = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;

        const existingCatalog = await catalogRepository.findOne({
            where: {
                title,
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });
        if (existingCatalog) {
            res.json({
                data: null,
                error: 'Catalog with this title already exists',
                status: 400
            });
            return;
        }

        const catalog = new Catalog();
        catalog.title = title;

        const savedCatalog = await catalogRepository.save(catalog);

        const { createdAt, deletedAt, ...catalogData } = savedCatalog;

        res.json({
            data: catalogData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const updateCatalog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

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
            res.json({
                data: null,
                error: 'Catalog not found',
                status: 400
            });
            return;
        }

        catalog.title = title;
        const updatedCatalog = await catalogRepository.save(catalog);

        const { createdAt, deletedAt, ...catalogData } = updatedCatalog;

        res.json({
            data: catalogData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const deleteCatalog = async (req: Request, res: Response) => {
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
            res.json({
                data: null,
                error: 'Catalog not found',
                status: 400
            });
            return;
        }

        catalog.deletedAt = new Date();
        await catalogRepository.save(catalog);

        res.json({
            data: { message: 'Catalog deleted successfully' },
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

// Subcatalog Controllers
export const getSubcatalogWithCategoryByCatalogId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const queryBuilder = subcatalogRepository.createQueryBuilder('subcatalog')
            .leftJoinAndSelect('subcatalog.categories', 'category')
            .where('subcatalog.catalogId = :catalogId', { catalogId: id })
            .andWhere('subcatalog.deletedAt IS NULL')
            .orderBy('subcatalog.createdAt', 'DESC');

        const subcatalogs = await queryBuilder.getMany();
        console.log(subcatalogs);
        

        if (!subcatalogs.length) {
            res.json({
                data: [],
                error: null,
                status: 200
            });
            return;
        }

        const formattedSubcatalogs = subcatalogs.map(subcatalog => {
            const { createdAt, deletedAt, categories, ...subcatalogData } = subcatalog;
            return subcatalogData;
        });

        res.json({
            data: formattedSubcatalogs,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const getSubcatalogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const subcatalog = await subcatalogRepository.findOne({
            where: {
                catalogId: id,
                deletedAt: IsNull()
            }
        });

        if (!subcatalog) {
            res.json({
                data: null,
                error: 'Subcatalog not found',
                status: 404
            });
            return;
        }

        const { createdAt, deletedAt, ...subcatalogData } = subcatalog;

        res.json({
            data: subcatalogData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const createSubcatalog = async (req: Request, res: Response) => {
    try {
        const { title, catalogId } = req.body;

        const existingSubcatalog = await subcatalogRepository.findOne({
            where: {
                title,
                catalogId,
                deletedAt: IsNull()
            }
        });

        if (existingSubcatalog) {
            res.json({
                data: null,
                error: 'Subcatalog with this title already exists in this catalog',
                status: 400
            });
            return;
        }

        const catalog = await catalogRepository.findOne({
            where: {
                id: catalogId,
                deletedAt: IsNull()
            }
        });

        if (!catalog) {
            res.json({
                data: null,
                error: 'Parent catalog not found',
                status: 404
            });
            return;
        }

        const subcatalog = new Subcatalog();
        subcatalog.title = title;
        subcatalog.catalogId = catalogId;

        const savedSubcatalog = await subcatalogRepository.save(subcatalog);

        const { createdAt, deletedAt, ...subcatalogData } = savedSubcatalog;

        res.json({
            data: subcatalogData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const updateSubcatalog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, catalogId } = req.body;

        const subcatalog = await subcatalogRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!subcatalog) {
            res.json({
                data: null,
                error: 'Subcatalog not found',
                status: 404
            });
            return;
        }

        if (catalogId) {
            const catalog = await catalogRepository.findOne({
                where: {
                    id: catalogId,
                    deletedAt: IsNull()
                }
            });

            if (!catalog) {
                res.json({
                    data: null,
                    error: 'Parent catalog not found',
                    status: 404
                });
                return;
            }
            subcatalog.catalogId = catalogId;
        }

        if (title) {
            subcatalog.title = title;
        }

        const updatedSubcatalog = await subcatalogRepository.save(subcatalog);

        const { createdAt, deletedAt, ...subcatalogData } = updatedSubcatalog;

        res.json({
            data: subcatalogData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const deleteSubcatalog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const subcatalog = await subcatalogRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!subcatalog) {
            res.json({
                data: null,
                error: 'Subcatalog not found',
                status: 404
            });
            return;
        }

        subcatalog.deletedAt = new Date();
        await subcatalogRepository.save(subcatalog);

        res.json({
            data: { message: 'Subcatalog deleted successfully' },
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

// Category Controllers
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { title, path, subCatalogId } = req.body;

        const existingCategory = await categoryRepository.findOne({
            where: {
                title,
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });
        if (existingCategory) {
            res.json({
                data: null,
                error: 'Category with this title already exists',
                status: 400
            });
            return;
        }

        const subcatalog = await subcatalogRepository.findOne({
            where: {
                id: subCatalogId,
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });
        if (!subcatalog) {
            res.json({
                data: null,
                error: 'Parent subcatalog not found',
                status: 400
            });
            return;
        }

        const category = new Category();
        category.title = title;
        category.path = path;
        category.subCatalogId = subCatalogId;

        const savedCategory = await categoryRepository.save(category);

        const { createdAt, deletedAt, ...categoryData } = savedCategory;

        res.json({
            data: categoryData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, path, subCatalogId } = req.body;

        const category = await categoryRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });
        if (!category) {
            res.json({
                data: null,
                error: 'Category not found',
                status: 400
            });
            return;
        }

        if (subCatalogId) {
            const subcatalog = await subcatalogRepository.findOne({
                where: {
                    id: subCatalogId,
                    deletedAt: IsNull()
                },
                order: {
                    createdAt: 'DESC'
                }
            });
            if (!subcatalog) {
                res.json({
                    data: null,
                    error: 'Parent subcatalog not found',
                    status: 400
                });
                return;
            }
            category.subCatalogId = subCatalogId;
        }

        if (title) category.title = title;
        if (path) category.path = path;

        const updatedCategory = await categoryRepository.save(category);

        const { createdAt, deletedAt, ...categoryData } = updatedCategory;

        res.json({
            data: categoryData,
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const category = await categoryRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });
        if (!category) {
            res.json({
                data: null,
                error: 'Category not found',
                status: 400
            });
            return;
        }

        category.deletedAt = new Date();
        await categoryRepository.save(category);

        res.json({
            data: { message: 'Category deleted successfully' },
            error: null,
            status: 200
        });
        return;
    } catch (error: unknown) {
        res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
        return;
    }
};
