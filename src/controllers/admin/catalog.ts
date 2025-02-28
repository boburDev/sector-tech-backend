import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Catalog, Subcatalog, Category } from '../../entities/catalog.entity';
import { ILike, In, IsNull, Not } from 'typeorm';
import { createSlug } from '../../utils/slug';
import { deleteFile } from '../../middlewares/removeFiltePath';
import { PopularCategory } from '../../entities/popular.entity';

const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);
const popularCategoryRepository = AppDataSource.getRepository(PopularCategory);
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

export const createCatalog = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title } = req.body;

          const lowerTitle = title.toLowerCase();

        const existingCatalog = await catalogRepository.findOne({
            where: {
                title: ILike(lowerTitle),
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });
        if (existingCatalog) {
            return res.json({
                data: null,
                error: 'Catalog with this title already exists',
                status: 400
            });
        }

        const catalog = new Catalog();
        catalog.title = title;
        catalog.slug = createSlug(title)

        const savedCatalog = await catalogRepository.save(catalog);

        const { createdAt, deletedAt, ...catalogData } = savedCatalog;

        return res.json({
            data: catalogData,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCatalog = async (req: Request, res: Response): Promise<any> => {
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
            return res.json({
                data: null,
                error: 'Catalog not found',
                status: 400
            });
        }

        catalog.title = title;
        catalog.slug = createSlug(title);

        const updatedCatalog = await catalogRepository.save(catalog);

        const { createdAt, deletedAt, ...catalogData } = updatedCatalog;

        return res.json({
            data: catalogData,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteCatalog = async (req: Request, res: Response): Promise<any> => {
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

        catalog.deletedAt = new Date();
        await catalogRepository.save(catalog);

        return res.json({
            data: { message: 'Catalog deleted successfully' },
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

export const createSubcatalog = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, catalogId } = req.body;
        console.log(req.body);
        

        // Validate required fields
        if (!title || !catalogId) {
            return res.json({
                data: null,
                error: 'Title and catalogId are required',
                status: 400
            });
        }

        // Check if subcatalog already exists
        const existingSubcatalog = await subcatalogRepository
            .createQueryBuilder('subcatalog')
            .where('LOWER(subcatalog.title) = LOWER(:title)', { title })
            .andWhere('subcatalog.catalogId = :catalogId', { catalogId })
            .andWhere('subcatalog.deletedAt IS NULL')
            .getOne();

        if (existingSubcatalog) {
            return res.json({
                data: null,
                error: 'Subcatalog with this title already exists in this catalog',
                status: 400
            });
        }

        // Verify parent catalog exists
        const catalog = await catalogRepository
            .createQueryBuilder('catalog')
            .where('catalog.id = :id', { id: catalogId })
            .andWhere('catalog.deletedAt IS NULL')
            .getOne();

        if (!catalog) {
            return res.json({
                data: null,
                error: 'Parent catalog not found',
                status: 404
            });
        }

        // Create and save new subcatalog
        const subcatalog = subcatalogRepository.create({
            title: title.trim(),
            slug:createSlug(title.trim()),
            catalogId: catalogId,
            catalog: catalog
        });

        const savedSubcatalog = await subcatalogRepository.save(subcatalog);

        if (!savedSubcatalog) {
            return res.json({
                data: null,
                error: 'Failed to create subcatalog',
                status: 500
            });
        }

        // Format response data
        const { createdAt, deletedAt, ...subcatalogData } = savedSubcatalog;

        return res.json({
            data: subcatalogData,
            error: null,
            status: 200
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSubcatalog = async (req: Request, res: Response): Promise<any> => {
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
            return res.json({
                data: null,
                error: 'Subcatalog not found',
                status: 404
            });
        }

        if (catalogId) {
            const catalog = await catalogRepository.findOne({
                where: {
                    id: catalogId,
                    deletedAt: IsNull()
                }
            });

            if (!catalog) {
                return res.json({
                    data: null,
                    error: 'Parent catalog not found',
                    status: 404
                });
            }
            subcatalog.catalogId = catalogId;
        }

        if (title) {
            subcatalog.title = title;
            subcatalog.slug = createSlug(title)
        }

        const updatedSubcatalog = await subcatalogRepository.save(subcatalog);

        const { createdAt, deletedAt, ...subcatalogData } = updatedSubcatalog;

        return res.json({
            data: subcatalogData,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSubcatalog = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

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

        subcatalog.deletedAt = new Date();
        await subcatalogRepository.save(subcatalog);

        return res.json({
            data: { message: 'Subcatalog deleted successfully' },
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
        const { isPopular } = req.query;

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

        let whereCondition: any = {
            subCatalogId: id,
            deletedAt: IsNull(),
        };

        if (isPopular === "true") {
            whereCondition.isPopular = true;
        } else if (isPopular === "false") {
            whereCondition.isPopular = false;
        }

        const categories = await categoryRepository.find({
            where: whereCondition,
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

export const createCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, subCatalogId } = req.body;

        const file = req.file as Express.Multer.File;

        if (!title || !file || !subCatalogId) {
            return res.json({
                data: null,
                error: 'Title, logo file and subCatalogId are required',
                status: 400
            });
        }
        
        const existingCategory = await categoryRepository.findOne({
            where: {
                title: ILike(title.toLowerCase()),
                deletedAt: IsNull()
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (existingCategory) {
            return res.json({
                data: null,
                error: 'Category with this title already exists',
                status: 400
            });
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
            return res.json({
                data: null,
                error: 'Parent subcatalog not found',
                status: 400
            });
        }
        const newPath = file.path.replace(/\\/g, "/").replace(/^public\//, "");

        const category = new Category();
        category.title = title;
        category.slug = createSlug(title);

        category.path = newPath;
        category.subCatalogId = subCatalogId;

        const savedCategory = await categoryRepository.save(category);
        const { createdAt, deletedAt, ...categoryData } = savedCategory;
        return res.json({
            data: categoryData,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { title, subCatalogId } = req.body;
        const file = req.file as Express.Multer.File;

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
            return res.json({
                data: null,
                error: 'Category not found',
                status: 400
            });
        }

        if (title !== category.title) {
            const existingCategory = await categoryRepository.findOne({
                where: {
                    title: ILike(title.toLowerCase()),
                    deletedAt: IsNull()
                }
            });

            if (existingCategory) {
                return res.json({
                    data: null,
                    error: 'Category with this title already exists',
                    status: 400
                });
            }
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
                return res.json({
                    data: null,
                    error: 'Parent subcatalog not found',
                    status: 400
                });
            }
            category.subCatalogId = subCatalogId;
        }

        if (file) {
            deleteFile(category.path)
            const newPath = file.path.replace(/\\/g, "/").replace(/^public\//, "");
            category.path = newPath;
        }
        if (title) {
             category.title = title
             category.slug = createSlug(title)
        }
        const updatedCategory = await categoryRepository.save(category);

        const { createdAt, deletedAt, ...categoryData } = updatedCategory;
        return res.json({
            data: categoryData,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
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
            return res.json({
                data: null,
                error: 'Category not found',
                status: 400
            });
        }

        category.deletedAt = new Date();
        await categoryRepository.save(category);

        return res.json({
            data: { message: 'Category deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createPopularCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        let { categoryIds } = req.body;

        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        if (categoryIds.length === 0) {
            return res.status(400).json({ message: "Invalid or empty categoryIds" });
        }

        const categories = await categoryRepository.find({
            where: { id: In(categoryIds), deletedAt: IsNull() }
        });

        if (categories.length === 0) {
            return res.status(404).json({ message: "No valid categories found" });
        }

        const updatedCategories = [];

        for (const category of categories) {
            const existingPopular = await popularCategoryRepository.findOne({
                where: { categoryId: category.id }
            });

            if (existingPopular) {
                continue; 
            }

            const newPopularCategory = popularCategoryRepository.create({
                categoryId: category.id,
                category: category
            });

            await popularCategoryRepository.save(newPopularCategory);
            updatedCategories.push(newPopularCategory);
        }

        return res.status(200).json({
            message: "Popular categories created successfully",
            data: updatedCategories,
            error: null,
            status: 200
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        const { popular } = req.query;

        let whereCondition: any = { deletedAt: IsNull() };

        if (popular === "true") {
            whereCondition.popularCategory = { id: Not(IsNull()) };
        }

        const categories = await categoryRepository.find({
            where: whereCondition,
            order: { createdAt: "DESC" },
            relations: ["popularCategory"],
            select: {
                id: true,
                title: true,
                path: true,
                slug: true,
                ...(popular === "true" ? { popularCategory: { id: true } } : {})
            }
        });

        return res.status(200).json({ data: categories, error: null, status: 200 });
    } catch (error) {
        console.error("getCategories Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


