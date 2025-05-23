import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Catalog, Subcatalog, Category } from '../../entities/catalog.entity';
import { ILike, In, IsNull, Not } from 'typeorm';
import { createSlug } from '../../utils/slug';
import { deleteFile } from '../../middlewares/removeFiltePath';
import { PopularCategory } from '../../entities/popular.entity';
import { CustomError } from '../../error-handling/error-handling';
import { Product } from '../../entities/products.entity';

const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);
const popularCategoryRepository = AppDataSource.getRepository(PopularCategory);
const productRepository = AppDataSource.getRepository(Product);
// Catalog Controllers
export const getCatalogById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

        if (!catalog) throw new CustomError('Catalog not found', 404);

        const { createdAt, deletedAt, ...catalogData } = catalog;

        return res.json({
            data: catalogData,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCatalogs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const catalogs = await catalogRepository
            .createQueryBuilder('catalog')
            .leftJoinAndSelect('catalog.subcatalogs', 'subcatalogs', 'subcatalogs.deletedAt IS NULL')
            .where('catalog.deletedAt IS NULL')
            .orderBy('catalog.updatedAt', 'ASC')
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
        next(error);
    }
};

export const createCatalog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
            throw new CustomError('Catalog with this title already exists', 400)
        }

        const catalogCount = await catalogRepository.count({
            withDeleted: true
        });

        const numberPrefix = String(catalogCount + 1).padStart(4, '0'); // 0001, 0002, ...
        const slug = `${numberPrefix}.${createSlug(title)}`;


        const catalog = new Catalog();
        catalog.title = title;
        catalog.slug = slug;

        const savedCatalog = await catalogRepository.save(catalog);

        const { createdAt, deletedAt, ...catalogData } = savedCatalog;

        return res.json({
            data: catalogData,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const updateCatalog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
        if (!catalog) throw new CustomError('Catalog not found', 404);

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
        next(error);
    }
};

export const deleteCatalog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
        if (!catalog) throw new CustomError('Catalog not found', 404);

        catalog.deletedAt = new Date();
        await catalogRepository.save(catalog);

        return res.json({
            data: { message: 'Catalog deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

// Subcatalog Controllers
export const getSubcatalogWithCategoryByCatalogId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;

        // First check if catalog exists
        const catalog = await catalogRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            },
            order: {
                updatedAt: 'ASC'
            }
        });

        if (!catalog) throw new CustomError('Catalog not found', 404);
        
        // Get subcatalogs with categories for this catalog
        const queryBuilder = subcatalogRepository.createQueryBuilder('subcatalog')
            .leftJoinAndSelect('subcatalog.categories', 'category', 'category.deletedAt IS NULL')
            .where('subcatalog.catalogId = :catalogId', { catalogId: id })
            .andWhere('subcatalog.deletedAt IS NULL')
            .orderBy('subcatalog.updatedAt', 'ASC')
            .addOrderBy('category.updatedAt', 'ASC');

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
        next(error);
    }
};

export const getSubcatalogById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;

        const subcatalog = await subcatalogRepository.findOne({
            relations: ['catalog'],
            where: {
                id,
                deletedAt: IsNull()
            },
            select: {
                id: true,
                title: true,
                slug: true,
                catalogId: true,
                catalog: {
                    id: true,
                    title: true,
                    slug: true,
                }
            }
        });

        if (!subcatalog) {
            throw new CustomError("Subcatalog not found", 404)
        }

        // `createdAt` va `deletedAt` ni olib tashlash
        const { createdAt, deletedAt, ...filteredSubcatalog } = subcatalog;

        return res.json({
            data: filteredSubcatalog,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const createSubcatalog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { title, catalogId } = req.body;

        if (!title || !catalogId) throw new CustomError('Title and catalogId are required', 400);

        const existingSubcatalog = await subcatalogRepository
            .createQueryBuilder('subcatalog')
            .where('LOWER(subcatalog.title) = LOWER(:title)', { title })
            .andWhere('subcatalog.catalogId = :catalogId', { catalogId })
            .andWhere('subcatalog.deletedAt IS NULL')
            .getOne();

        if (existingSubcatalog) throw new CustomError('Subcatalog with this title already exists in this catalog', 400);

        const catalog = await catalogRepository
            .createQueryBuilder('catalog')
            .where('catalog.id = :id', { id: catalogId })
            .andWhere('catalog.deletedAt IS NULL')
            .getOne();

        if (!catalog) throw new CustomError('Parent catalog not found', 404);

        const subcatalogCount = await subcatalogRepository.count({
            withDeleted: true
        });

        const numberPrefix = String(subcatalogCount + 100).padStart(4, '0'); // 0100, 0101, ...
        const slug = `${numberPrefix}.${createSlug(title.trim())}`;

        const subcatalog = subcatalogRepository.create({
            title: title.trim(),
            slug: slug,
            catalogId: catalogId,
            catalog: catalog
        });

        const savedSubcatalog = await subcatalogRepository.save(subcatalog);

        if (!savedSubcatalog) throw new CustomError('Failed to create subcatalog', 400);

        // Format response data
        const { createdAt, deletedAt, ...subcatalogData } = savedSubcatalog;

        return res.json({
            data: subcatalogData,   
            error: null,
            status: 200
        });

    } catch (error) {
        next(error);
    }
};

export const updateSubcatalog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { title, catalogId } = req.body;

        const subcatalog = await subcatalogRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

        if (!subcatalog) throw new CustomError('Subcatalog not found', 404);

        if (catalogId) {
            const catalog = await catalogRepository.findOne({
                where: {
                    id: catalogId,
                    deletedAt: IsNull()
                }
            });

            if (!catalog) throw new CustomError('Parent catalog not found', 404);
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
        next(error);
    }
};

export const deleteSubcatalog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;

        const subcatalog = await subcatalogRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            }
        });

            if (!subcatalog) throw new CustomError('Subcatalog not found', 404);

        subcatalog.deletedAt = new Date();
        await subcatalogRepository.save(subcatalog);

        return res.json({
            data: { message: 'Subcatalog deleted successfully' },
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const getProductsBySubcatalogIdAndCategoryId = async (req: Request,res: Response,next: NextFunction): Promise<any> => {
    try {
        const { subCatalogId, categoryId } = req.query;

        let whereCondition: any = {
            deletedAt: IsNull(),
        };

        if (subCatalogId) {
            const subcatalogExists = await subcatalogRepository.findOne({
                where: { id: subCatalogId as string, deletedAt: IsNull() },
            });
            if (!subcatalogExists) throw new CustomError("Subcatalog not found", 404);

            whereCondition.subcatalogId = subCatalogId as string;
        }

        if (categoryId) {
            const categoryExists = await categoryRepository.findOne({
                where: { id: categoryId as string, deletedAt: IsNull() },
            });
            if (!categoryExists) throw new CustomError("Category not found", 404);

            whereCondition.categoryId = categoryId as string;
        }

        const products = await productRepository.find({
            where: whereCondition,
            order: {
                createdAt: 'DESC'
            }
        });

        return res.status(200).json({
            data: products,
            error: null,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
};

// Category Controllers
export const getCategoriesBySubcatalogId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { popular } = req.query;

        const subcatalog = await subcatalogRepository.findOne({
            where: {
                id,
                deletedAt: IsNull()
            },
            order: {
                updatedAt: "ASC"
            }
        });

        if (!subcatalog) throw new CustomError('Subcatalog not found', 404);

        let whereCondition: any = {
            subCatalogId: id,
            deletedAt: IsNull(),
        };

        if (popular === "true") {
            whereCondition.popularCategory = { id: Not(IsNull()) };
        } else if (popular === "false") {
            whereCondition.popularCategory = { id: IsNull() };
        }

        const categories = await categoryRepository.find({
            where: whereCondition,
            relations: ["popularCategory"],
            select: {
                id: true,
                title: true,
                path: true,
                slug: true,
                updatedAt: true,
                ...(popular === "true" ? { popularCategory: { id: true } } : {}),
                subCatalogId: true,
            },
            order: {
                updatedAt: 'ASC'
            },
        });

        if (!categories.length) {
            return res.json({
                data: [],
                error: null,
                status: 200
            });
        }

        return res.json({
            data: categories,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { title, subCatalogId } = req.body;
        const file = req.file as Express.Multer.File | undefined; 

        if (!title || !subCatalogId) {
            throw new CustomError('Title and subCatalogId are required', 400)
        }

        const existingCategory = await categoryRepository.findOne({
            where: {
                title: ILike(title.toLowerCase()),
                deletedAt: IsNull(),
            },
            order: { createdAt: "DESC" },
        });

        if (existingCategory) {
            throw new CustomError('Category with this title already exists',400)
        }

        const subcatalog = await subcatalogRepository.findOne({
            where: {
                id: subCatalogId,
                deletedAt: IsNull(),
            },
            order: { createdAt: "DESC" },
        });

        if (!subcatalog) throw new CustomError("Parent subcatalog not found", 400);

        const category = new Category();
        category.title = title;
        category.slug = createSlug(title);
        category.subCatalogId = subCatalogId;

        if (file) {
            category.path = file.path.replace(/\\/g, "/").replace(/^public\//, ""); 
        }

        const savedCategory = await categoryRepository.save(category);
        const { createdAt, deletedAt, ...categoryData } = savedCategory;

        return res.json({
            data: categoryData,
            error: null,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

        if (!category) throw new CustomError('Category not found', 404);

        if (title !== category.title) {
            const existingCategory = await categoryRepository.findOne({
                where: {
                    title: ILike(title.toLowerCase()),
                    deletedAt: IsNull()
                }
            });

            if (existingCategory) {
                throw new CustomError('Category with this title already exists', 400 )
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
            if (!subcatalog) throw new CustomError('Parent subcatalog not found', 400);
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
        next(error);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

        if (!category) throw new CustomError('Category not found', 404);

        category.deletedAt = new Date();
        await categoryRepository.save(category);

        return res.json({
            data: { message: 'Category deleted successfully' },
            error: null,
            status: 200
        }); 
    } catch (error) {
        next(error);
    }
};

export const togglePopularCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let { categoryIds } = req.body;

        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        if (!categoryIds || categoryIds.length === 0) throw new CustomError("categoryIds is required", 400);

        const existingPopularCategories = await popularCategoryRepository.find({
            where: { categoryId: In(categoryIds) }  
        });

        if (existingPopularCategories.length > 0) {
            await popularCategoryRepository.delete({ categoryId: In(categoryIds) });
            return res.status(200).json({
                data: { message: 'Popular category deleted successfully' },
                error: null,
                status: 200
            });
        }

        const newPopularCategories = popularCategoryRepository.create(
            categoryIds.map((categoryId: string) => ({
                categoryId: categoryId,
                updatedAt: new Date()
            }))
        );

        await popularCategoryRepository.save(newPopularCategories);

        return res.status(201).json({
            data: { message: 'Popular categories created successfully' },
            error: null,
            status: 201
        });

    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { popular } = req.query;

        if (popular === "true") {
            const popularCategories = await popularCategoryRepository.find({
                where: { categoryId: Not(IsNull()) },
                order: { updatedAt: "ASC" },
                relations: ["category"],
                select: {
                    id: true,
                    updatedAt: true,
                    category: {
                        id: true,
                        title: true,
                        path: true,
                        slug: true,
                        deletedAt: true
                    }
                }
            });
            return res.status(200).json({ data: popularCategories, error: null, status: 200 });
        }
    } catch (error) {
        next(error);
    }
};


