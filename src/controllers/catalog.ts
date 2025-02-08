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
            return res.json({
                data: null, 
                error: 'Catalog not found',
                status: 400
            });
        }

        return res.json({
            data: catalog,
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

export const getAllCatalogs = async (req: Request, res: Response) => {
    try {
        const catalogs = await catalogRepository
            .createQueryBuilder('catalog')
            .leftJoinAndSelect('catalog.subcatalogs', 'subcatalogs')
            .orderBy('catalog.createdAt', 'DESC')
            .getMany();
        
        return res.json({
            data: catalogs,
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

export const createCatalog = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;

        const existingCatalog = await catalogRepository.findOne({ where: { title } });
        if (existingCatalog) {
            return res.json({
                data: null,
                error: 'Catalog with this title already exists',
                status: 400
            });
        }

        const catalog = new Catalog();
        catalog.title = title;

        const savedCatalog = await catalogRepository.save(catalog);
        return res.json({
            data: savedCatalog,
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

export const updateCatalog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const catalog = await catalogRepository.findOne({ where: { id } });
        if (!catalog) {
            return res.json({
                data: null,
                error: 'Catalog not found',
                status: 400
            });
        }

        catalog.title = title;
        const updatedCatalog = await catalogRepository.save(catalog);
        return res.json({
            data: updatedCatalog,
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

export const deleteCatalog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const catalog = await catalogRepository.findOne({ where: { id } });
        if (!catalog) {
            return res.json({
                data: null,
                error: 'Catalog not found',
                status: 400
            });
        }

        await catalogRepository.softDelete(id);
        return res.json({
            data: { message: 'Catalog deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

// Subcatalog Controllers
export const createSubcatalog = async (req: Request, res: Response) => {
    try {
        const { title, catalogId } = req.body;

        const existingSubcatalog = await subcatalogRepository.findOne({ where: { title } });
        if (existingSubcatalog) {
            return res.json({
                data: null,
                error: 'Subcatalog with this title already exists',
                status: 400
            });
        }

        const catalog = await catalogRepository.findOne({ where: { id: catalogId } });
        if (!catalog) {
            return res.json({
                data: null,
                error: 'Parent catalog not found',
                status: 400
            });
        }

        const subcatalog = new Subcatalog();
        subcatalog.title = title;
        subcatalog.catalogId = catalogId;

        const savedSubcatalog = await subcatalogRepository.save(subcatalog);
        return res.json({
            data: savedSubcatalog,
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

export const updateSubcatalog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, catalogId } = req.body;

        const subcatalog = await subcatalogRepository.findOne({ where: { id } });
        if (!subcatalog) {
            return res.json({
                data: null,
                error: 'Subcatalog not found',
                status: 400
            });
        }

        if (catalogId) {
            const catalog = await catalogRepository.findOne({ where: { id: catalogId } });
            if (!catalog) {
                return res.json({
                    data: null,
                    error: 'Parent catalog not found',
                    status: 400
                });
            }
            subcatalog.catalogId = catalogId;
        }

        if (title) {
            subcatalog.title = title;
        }

        const updatedSubcatalog = await subcatalogRepository.save(subcatalog);
        return res.json({
            data: updatedSubcatalog,
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

export const deleteSubcatalog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const subcatalog = await subcatalogRepository.findOne({ where: { id } });
        if (!subcatalog) {
            return res.json({
                data: null,
                error: 'Subcatalog not found',
                status: 400
            });
        }

        await subcatalogRepository.softDelete(id);
        return res.json({
            data: { message: 'Subcatalog deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

// Category Controllers
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { title, path, subCatalogId } = req.body;

        const existingCategory = await categoryRepository.findOne({ where: { title } });
        if (existingCategory) {
            return res.json({
                data: null,
                error: 'Category with this title already exists',
                status: 400
            });
        }

        const subcatalog = await subcatalogRepository.findOne({ where: { id: subCatalogId } });
        if (!subcatalog) {
            return res.json({
                data: null,
                error: 'Parent subcatalog not found',
                status: 400
            });
        }

        const category = new Category();
        category.title = title;
        category.path = path;
        category.subCatalogId = subCatalogId;

        const savedCategory = await categoryRepository.save(category);
        return res.json({
            data: savedCategory,
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, path, subCatalogId } = req.body;

        const category = await categoryRepository.findOne({ where: { id } });
        if (!category) {
            return res.json({
                data: null,
                error: 'Category not found',
                status: 400
            });
        }

        if (subCatalogId) {
            const subcatalog = await subcatalogRepository.findOne({ where: { id: subCatalogId } });
            if (!subcatalog) {
                return res.json({
                    data: null,
                    error: 'Parent subcatalog not found',
                    status: 400
                });
            }
            category.subCatalogId = subCatalogId;
        }

        if (title) category.title = title;
        if (path) category.path = path;

        const updatedCategory = await categoryRepository.save(category);
        return res.json({
            data: updatedCategory,
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const category = await categoryRepository.findOne({ where: { id } });
        if (!category) {
            return res.json({
                data: null,
                error: 'Category not found',
                status: 400
            });
        }

        await categoryRepository.softDelete(id);
        return res.json({
            data: { message: 'Category deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error: unknown) {
        return res.json({
            data: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 400
        });
    }
};


