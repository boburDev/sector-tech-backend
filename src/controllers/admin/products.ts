import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Product } from '../../entities/products.entity';
import { In, IsNull, Not } from 'typeorm';
import { productSchema } from '../../validators/product.validator';
import { createSlug } from '../../utils/slug';
import { deleteFile, deleteFileBeforeSave } from '../../middlewares/removeFiltePath';
import { Brand } from '../../entities/brands.entity';
import { ProductCondition, ProductRelevance } from '../../entities/product_details.entity';
import { Catalog, Category, Subcatalog } from '../../entities/catalog.entity';
import { PopularProduct } from '../../entities/popular.entity';
import { CustomError } from '../../error-handling/error-handling';

const productRepository = AppDataSource.getRepository(Product);
const brandRepository = AppDataSource.getRepository(Brand);
const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const productRelevanceRepository = AppDataSource.getRepository(ProductRelevance);
const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);
const popularProductRepository = AppDataSource.getRepository(PopularProduct);

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { recommended, condition, revalance, popular } = req.query;
        const whereCondition: any = { deletedAt: IsNull() };

        const conditionMapping: Record<string, string> = {
            new: "novyy",
            seller: "seller-rfb"
        };

        const revalanceMapping: Record<string, string> = {
            active: "aktualnoe",
            inactive: "snyato-s-proizvodstva-eos"
        };

        if (condition && conditionMapping[condition as string]) {
            whereCondition.conditions = { slug: conditionMapping[condition as string] };
        }

        if (revalance && revalanceMapping[revalance as string]) {
            whereCondition.relevances = { slug: revalanceMapping[revalance as string] };
        }

        if (recommended !== undefined) {
            whereCondition.recommended = JSON.parse(recommended as string);
        }

        const relations: string[] = [];
        if (popular !== undefined) {
            relations.push("popularProduct");
            whereCondition.popularProduct = {
                id: popular === "true" ? Not(IsNull()) : IsNull(),
            };
        }

        relations.push("brand");

        const products = await productRepository.find({
            relations,
            where: whereCondition,
            order: { createdAt: "DESC" },
            select: {
                id: true,
                title: true,
                slug: true,
                articul: true,
                inStock: true,
                price: true,
                mainImage: true,
                recommended: true,
                catalogId: true,
                subcatalogId: true,
                categoryId: true,
                brandId: true,
                conditionId: true,
                relevanceId: true,
                description: true,
                fullDescription: true,
                fullDescriptionImages: true,
                characteristics: true,
                productCode: true,
                garanteeIds: true,  
                images: true,
                brand: {
                    id: true,
                    title: true,
                    slug: true,
                },
                ...(popular && {
                    popularProduct: { id: true },
                }),
            },
        });

        return res.status(200).json({ data: products, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const product = await productRepository.findOne({
            relations: [
                "comments",
                "questions",
                "brand",
                "conditions",
                "relevances",
                "catalog",
                "subcatalog",
                "category"
            ],
            select: {
                id: true,
                title: true,
                slug: true,
                articul: true,
                productCode: true,
                description: true,
                inStock: true,
                price: true,
                mainImage: true,
                fullDescription: true,
                fullDescriptionImages: true,
                characteristics: true,
                catalogId: true,
                subcatalogId: true,
                categoryId: true,
                brandId: true,
                conditionId: true,
                relevanceId: true,
                images: true,
                comments: {
                    id: true,
                    body: true,
                    reply: true,
                    star: true,
                },
                questions: {
                    id: true,
                    body: true,
                    reply: true,
                },
                brand: {
                    id: true,
                    path: true,
                    title: true,
                    slug: true,
                },
                conditions: {
                    id: true,
                    title: true,
                    slug: true,
                },
                relevances: {
                    id: true,
                    title: true,
                    slug: true
                },
                catalog: {
                    id: true,
                    slug: true,
                    title: true,
                },
                subcatalog: {
                    id: true,
                    slug: true,
                    title: true,
                },
                category: {
                    id: true,
                    slug: true,
                    title: true,
                }
            },
            where: {
                id,
                deletedAt: IsNull()
            }
        });

    if (!product) throw new CustomError('Product not found', 404);  

    res.json({
        data: product,
        error: null,
        status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const productMainImage = files['productMainImage'][0];
    const productImages = files["productImages"] || [];
    const fullDescriptionImages = files["fullDescriptionImages"] || [];

    try {
        const { error, value } = productSchema.validate(req.body);
        if (error) {
            deleteFileBeforeSave(productMainImage.path)

            productImages.forEach(file => {
                deleteFile(file.path)
            });
            fullDescriptionImages.forEach(file => {
                deleteFile(file.path)
            });
            return res.status(400).json({ error: error.details.map(err => err.message) });
        }
        // if (!productImages.length) throw new CustomError('Image must be uploaded', 400);

        const existsProduct = await productRepository.findOne({ where: { title: value.title }})
        if(existsProduct){
            throw new CustomError("Product already exist", 400)
        }
        const garanteeIds = value.garanteeIds || [];
        const images = productImages.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));
        const descImages = fullDescriptionImages.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));
        const mainImage = productMainImage.path.replace(/\\/g, "/").replace(/^public\//, "");
        const product = new Product();
        product.title = value.title;
        product.slug = createSlug(value.title);
        product.articul = value.articul;
        product.productCode = value.productCode;
        product.characteristics = JSON.parse(value.characteristics);
        product.description = value.description;
        product.fullDescription = value.fullDescription;
        product.price = value.price;
        product.inStock = value.inStock;
        product.brandId = value.brandId;
        product.conditionId = value.conditionId;
        product.relevanceId = value.relevanceId;
        product.catalogId = value.catalogId;
        product.subcatalogId = value.subcatalogId;
        product.categoryId = value.categoryId;
        product.images = images;
        if (descImages.length) {
            product.fullDescriptionImages = descImages;
        }
        product.mainImage = mainImage
        product.garanteeIds = garanteeIds;
        let savedProduct = await productRepository.save(product);
        
        const sortedData = {
            title: savedProduct.title,
            articul: savedProduct.articul,
            price: savedProduct.price,
            mainImage: savedProduct.mainImage
        };

        sortedData.mainImage = sortedData.mainImage.replace(/^public\//, "")

        res.json({ message: "Product created", data: sortedData });
    } catch (error) {
        console.error("Error creating product:", error);

        deleteFileBeforeSave(productMainImage.path)

        productImages.forEach(file => {
            deleteFile(file.path)
        });
        fullDescriptionImages.forEach(file => {
            deleteFile(file.path)
        });

        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const productMainImage = files["productMainImage"]?.[0] || null;
    const productImages = files["productImages"] || [];
    const fullDescriptionImages = files["fullDescriptionImages"] || [];
    const garanteeIds = req.body.garanteeIds || [];

    try {
        const value = req.body

        const product = await productRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!product) throw new CustomError('Product not found', 404);

        product.title = value.title || product.title;
        product.slug = value.title ? createSlug(value.title) : product.slug;
        product.articul = value.articul || product.articul;
        product.productCode = value.productCode || product.productCode;
        product.characteristics = value.characteristics ? JSON.parse(value.characteristics) : product.characteristics;
        product.description = value.description || product.description;
        product.fullDescription = value.fullDescription || product.fullDescription;
        product.price = value.price || product.price;
        product.inStock = value.inStock || product.inStock;
        product.garanteeIds = garanteeIds;

        if (value.brandId) {
            const brand = await brandRepository.findOne({ where: { id: value.brandId, deletedAt: IsNull() } });

            if (!brand) throw new CustomError('Invalid brand ID', 404);

            product.brandId = value.brandId;
        }

        if (value.conditionId) {
            const productCondition = await productConditionRepository.findOne({ where: { id: value.conditionId, deletedAt: IsNull() } });

            if (!productCondition) throw new CustomError('Invalid condition ID', 404);

            product.conditionId = value.conditionId;
        }
        
        if (value.relevanceId) {
            const productRelevance = await productRelevanceRepository.findOne({ where: { id: value.relevanceId, deletedAt: IsNull() } });

            if (!productRelevance) throw new CustomError('Invalid relevance ID', 404);
            product.relevanceId = value.relevanceId;
        }

        if (product.catalogId) {
            const catalog = await catalogRepository.findOne({ where: { id: product.catalogId, deletedAt: IsNull() } });

            if (!catalog) throw new CustomError('Invalid Catalog ID', 400);
            product.catalogId = value.catalogId;
        }

        if (value.subcatalogId) {
            const subcatalog = await subcatalogRepository.findOne({ where: { id: value.subcatalogId, deletedAt: IsNull() } });

            if (!subcatalog) throw new CustomError('Invalid subcatalog ID', 400);
            product.subcatalogId = value.subcatalogId;  
        }

        if (value.categoryId) {
            const category = await categoryRepository.findOne({ where: { id: value.categoryId, deletedAt: IsNull() } });

            if (!category) throw new CustomError('Invalid category ID', 400);
            product.categoryId = value.categoryId;
        }

        if (productImages.length) {
            const images = productImages.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));
            product.images = images;
        }

        if (fullDescriptionImages.length) {
            const descImages = fullDescriptionImages.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));
            product.fullDescriptionImages = descImages;
        }

        if (productMainImage) {
            deleteFile(product.mainImage)
            const newPath = productMainImage.path.replace(/\\/g, "/").replace(/^public\//, "");
            product.mainImage = newPath
        }

        let savedProduct = await productRepository.save(product);

        const sortedData = {
            title: savedProduct.title,
            articul: savedProduct.articul,
            price: savedProduct.price,
            mainImage: savedProduct.mainImage
        };

        sortedData.mainImage = sortedData.mainImage.replace(/^public\//, "")

        res.json({ message: "Product created", data: sortedData });
    } catch (error) {
        console.log(error);
        
        deleteFileBeforeSave(productMainImage.path)
        productImages.forEach(file => {
            deleteFile(file.path)
        });
        fullDescriptionImages.forEach(file => {
            deleteFile(file.path)
        });

        next(error);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const product = await productRepository.findOne({
            where: { id, deletedAt: IsNull() }
        });

            if (!product) throw new CustomError('Product not found or already deleted', 404);

        product.deletedAt = new Date();
        await productRepository.save(product);

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const toggleRecommendedProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { productId } = req.body;

        if (!productId) throw new CustomError('Product ID is required', 400);

        const product = await productRepository.findOne({ where: { id: productId, deletedAt: IsNull() } });

        if (!product) throw new CustomError('Product not found', 404);

        if (product.recommended) {
            product.recommended = false;
            await productRepository.save(product);
            return res.status(200).json({ message: "Product removed from recommended", id:product.id });
        }

        product.recommended = true;
        await productRepository.save(product);

        return res.status(200).json({ message: "Product added to recommended", id: product.id });
    } catch (error) {
        next(error);
    }
};

export const togglePopularProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let { productIds } = req.body;

        if (!Array.isArray(productIds)) {
            productIds = [productIds];
        }

        if (!productIds || productIds.length === 0) throw new CustomError('productIds is required', 400);

        const existingPopularProducts = await popularProductRepository.find({
            where: { productId: In(productIds) }
        });

        if (existingPopularProducts.length > 0) {
            await popularProductRepository.delete({ productId: In(productIds) });
            return res.status(200).json({
                data: { message: 'Popular product deleted successfully' },
                error: null,
                status: 200
            });
        }

        const newPopularProducts = popularProductRepository.create(
            productIds.map((productId: string) => ({
                productId: productId,
                updatedAt: new Date()
            }))
        );

        await popularProductRepository.save(newPopularProducts);

        return res.status(201).json({
            data: { message: 'Popular products created successfully' },
            error: null,
            status: 201
        });

    } catch (error) {
        next(error);
    }
};

export const deletePopularProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        if (!id) throw new CustomError('Product ID is required', 400);

        const popularProduct = await popularProductRepository.findOne({ where: { id: id } });

        if (!popularProduct) throw new CustomError('Popular product not found', 404);

        await popularProductRepository.delete(popularProduct);

        return res.status(200).json({ message: "Popular product deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const getProductsByCatalogSubcatalogCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { catalogSlug, subcatalogSlug, categorySlug } = req.query;
        const filter: any = { deletedAt: IsNull() };

        if (catalogSlug) {
            filter.catalog = { slug: catalogSlug as string, deletedAt: IsNull() };
        }
        if (subcatalogSlug) {
            filter.subcatalog = { slug: subcatalogSlug as string, deletedAt: IsNull() };
        }
        if (categorySlug) {
            filter.category = { slug: categorySlug as string, deletedAt: IsNull() };
        }
     
        const products = await productRepository.find({
            where: filter,
            order: { createdAt: "DESC" },
            select: {
                    id: true,
                    title: true,
                    slug: true,
                    articul: true,
                    inStock: true,
                    price: true,
                    mainImage: true,
                    productCode: true,
                    description: true,
                    fullDescription: true,
                    fullDescriptionImages: true,
                    characteristics: true,
                    catalogId: true,
                    subcatalogId: true,
                    categoryId: true,
                    brandId: true,
                    conditionId: true,
                    relevanceId: true,
                    images: true,
                    recommended: true,
                    popularProduct: { id: true },
                },
            },
        );

        return res.status(200).json({ data: products , error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};