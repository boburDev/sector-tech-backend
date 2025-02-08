import { Request, Response } from 'express';
import AppDataSource from '../config/ormconfig';
import { Catalog, Subcatalog, Category } from '../entities/catalog.entity';

const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);

// Catalog Controllers
export const getCatalogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const catalog = await catalogRepository.findOne({ where: { id } });

        if (!catalog) {
            res.json({
                data: null, 
                error: 'Catalog not found',
                status: 400
            });
            return;
        }

        res.json({
            data: catalog,
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
            .leftJoinAndSelect('catalog.subcatalogs', 'subcatalogs')
            .orderBy('catalog.createdAt', 'DESC')
            .getMany();
        
        res.json({
            data: catalogs,
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

        const existingCatalog = await catalogRepository.findOne({ where: { title } });
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
        
        res.json({
            data: savedCatalog,
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

        const catalog = await catalogRepository.findOne({ where: { id } });
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
        
        res.json({
            data: updatedCatalog,
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
        
        const catalog = await catalogRepository.findOne({ where: { id } });
        if (!catalog) {
            res.json({
                data: null,
                error: 'Catalog not found',
                status: 400
            });
            return;
        }

        await catalogRepository.softDelete(id);
        
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
export const createSubcatalog = async (req: Request, res: Response) => {
    try {
        const { title, catalogId } = req.body;

        const existingSubcatalog = await subcatalogRepository.findOne({ where: { title } });
        if (existingSubcatalog) {
            res.json({
                data: null,
                error: 'Subcatalog with this title already exists',
                status: 400
            });
            return;
        }

        const catalog = await catalogRepository.findOne({ where: { id: catalogId } });
        if (!catalog) {
            res.json({
                data: null,
                error: 'Parent catalog not found',
                status: 400
            });
            return;
        }

        const subcatalog = new Subcatalog();
        subcatalog.title = title;
        subcatalog.catalogId = catalogId;

        const savedSubcatalog = await subcatalogRepository.save(subcatalog);
        
        res.json({
            data: savedSubcatalog,
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

        const subcatalog = await subcatalogRepository.findOne({ where: { id } });
        if (!subcatalog) {
            res.json({
                data: null,
                error: 'Subcatalog not found',
                status: 400
            });
            return;
        }

        if (catalogId) {
            const catalog = await catalogRepository.findOne({ where: { id: catalogId } });
            if (!catalog) {
                res.json({
                    data: null,
                    error: 'Parent catalog not found',
                    status: 400
                });
                return;
            }
            subcatalog.catalogId = catalogId;
        }

        if (title) {
            subcatalog.title = title;
        }

        const updatedSubcatalog = await subcatalogRepository.save(subcatalog);
        
        res.json({
            data: updatedSubcatalog,
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
        
        const subcatalog = await subcatalogRepository.findOne({ where: { id } });
        if (!subcatalog) {
            res.json({
                data: null,
                error: 'Subcatalog not found',
                status: 400
            });
            return;
        }

        await subcatalogRepository.softDelete(id);
        
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

        const existingCategory = await categoryRepository.findOne({ where: { title } });
        if (existingCategory) {
            res.json({
                data: null,
                error: 'Category with this title already exists',
                status: 400
            });
            return;
        }

        const subcatalog = await subcatalogRepository.findOne({ where: { id: subCatalogId } });
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
        
        res.json({
            data: savedCategory,
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

        const category = await categoryRepository.findOne({ where: { id } });
        if (!category) {
            res.json({
                data: null,
                error: 'Category not found',
                status: 400
            });
            return;
        }

        if (subCatalogId) {
            const subcatalog = await subcatalogRepository.findOne({ where: { id: subCatalogId } });
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
        
        res.json({
            data: updatedCategory,
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
        
        const category = await categoryRepository.findOne({ where: { id } });
        if (!category) {
            res.json({
                data: null,
                error: 'Category not found',
                status: 400
            });
            return;
        }

        await categoryRepository.softDelete(id);
        
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
