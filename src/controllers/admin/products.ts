import { Request, Response } from 'express';
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

const productRepository = AppDataSource.getRepository(Product);
const brandRepository = AppDataSource.getRepository(Brand);
const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const productRelevanceRepository = AppDataSource.getRepository(ProductRelevance);
const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);
const popularProductRepository = AppDataSource.getRepository(PopularProduct);

export const getProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const condition = req.query.condition === "true";
        const relevance = req.query.relevance === "true";
        const { recommended, popular } = req.query;

        const queryBuilder = productRepository
            .createQueryBuilder("product")
            .leftJoin("product.popularProduct", "popularProduct")
            .where("product.deletedAt IS NULL");

        if (recommended === "true") {
            queryBuilder.andWhere("product.recommended = :recommended", { recommended: true });
        } else if (recommended === "false") {
            queryBuilder.andWhere("product.recommended = :recommended", { recommended: false });
        }

        if (popular === "true") {
            queryBuilder.andWhere("popularProduct.id IS NOT NULL");
        } else if (popular === "false") {
            queryBuilder.andWhere("popularProduct.id IS NULL");
        }

        if (condition) {
            queryBuilder.leftJoinAndSelect("product.conditions", "conditions");
        }

        if (relevance) {
            queryBuilder.leftJoinAndSelect("product.relevances", "relevances");
        }

        queryBuilder.select([
            "product.id",
            "product.title",
            "product.slug",
            "product.articul",
            "product.inStock",
            "product.price",
            "product.mainImage",
            "product.recommended",
            "popularProduct.id",
        ]);

        if (condition) {
            queryBuilder.addSelect([
                "conditions.id",
                "conditions.slug",
                "conditions.title",
            ]);
        }

        if (relevance) {
            queryBuilder.addSelect([
                "relevances.id",
                "relevances.slug",
                "relevances.title",
            ]);
        }

        const products = await queryBuilder
            .orderBy("product.createdAt", "DESC")
            .getMany();

        return res.status(200).json({ data: products, error: null, status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const product = await productRepository.findOne({
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
      },
      where: [
        { id, deletedAt: IsNull() },
        { slug: id, deletedAt: IsNull() },
      ],
    });

    if (!product) {
        return res.status(404).json({
            data: null,
            error: 'Product not found',
            status: 404
        });
    }

    res.json({
        data: product,
        error: null,
        status: 200
    });
};

export const createProduct = async (req: Request, res: Response): Promise<any> => {
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
        if (!productImages.length) return res.status(400).json({ error: 'Image must be uploaded' });
        
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

        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const productMainImage = files["productMainImage"]?.[0] || null;
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

        const product = await productRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!product) {
            return res.status(404).json({
                data: null,
                error: 'Product not found',
                status: 404
            });
        }

        product.title = value.title || product.title;
        product.slug = value.title ? createSlug(value.title) : product.slug;
        product.articul = value.articul || product.articul;
        product.productCode = value.productCode || product.productCode;
        product.characteristics = value.characteristics ? JSON.parse(value.characteristics) : product.characteristics;
        product.description = value.description || product.description;
        product.fullDescription = value.fullDescription || product.fullDescription;
        product.price = value.price || product.price;
        product.inStock = value.inStock || product.inStock;

        if (value.brandId) {
            const brand = await brandRepository.findOne({ where: { id: value.brandId, deletedAt: IsNull() } });

            if (!brand) {
                return res.json({
                    data: null,
                    error: 'Invalid brand ID',
                    status: 404
                });
            }

            product.brandId = value.brandId;
        }

        if (value.conditionId) {
            const productCondition = await productConditionRepository.findOne({ where: { id: value.conditionId, deletedAt: IsNull() } });

            if (!productCondition) {
                return res.json({
                    data: null,
                    error: 'Invalid condition ID',
                    status: 404
                });
            }
            product.conditionId = value.conditionId;
        }
        
        if (value.relevanceId) {
            const productRelevance = await productRelevanceRepository.findOne({ where: { id: value.relevanceId, deletedAt: IsNull() } });

            if (!productRelevance) {
                return res.json({
                    data: null,
                    error: 'Invalid relevance ID',
                    status: 404
                });
            }
            product.relevanceId = value.relevanceId;
        }

        if (product.catalogId) {
            const catalog = await catalogRepository.findOne({ where: { id: product.catalogId, deletedAt: IsNull() } });

            if (!catalog) {
                return res.json({
                    data: null,
                    error: 'Invalid Catalog ID',
                    status: 400
                });
            }
            product.catalogId = value.catalogId;
        }

        if (value.subcatalogId) {
            const subcatalog = await subcatalogRepository.findOne({ where: { id: value.subcatalogId, deletedAt: IsNull() } });

            if (!subcatalog) {
                return res.json({
                    data: null,
                    error: 'Invalid subcatalog ID',
                    status: 400
                });
            }
            product.subcatalogId = value.subcatalogId;
        }

        if (value.categoryId) {
            const category = await categoryRepository.findOne({ where: { id: value.categoryId, deletedAt: IsNull() } });

            if (!category) {
                return res.json({
                    data: null,
                    error: 'Invalid category ID',
                    status: 400
                });
            }
            product.categoryId = value.categoryId;
        }

        if (productImages.length) {
            const images = productImages.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));
            product.images = images;
        }

        if (productImages.length) {
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
        console.error("Error creating product:", error);
        deleteFileBeforeSave(productMainImage.path)
        productImages.forEach(file => {
            deleteFile(file.path)
        });
        fullDescriptionImages.forEach(file => {
            deleteFile(file.path)
        });

        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const product = await productRepository.findOne({
            where: { id, deletedAt: IsNull() }
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found or already deleted" });
        }

        product.deletedAt = new Date();
        await productRepository.save(product);

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const toggleRecommendedProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const product = await productRepository.findOne({ where: { id: productId, deletedAt: IsNull() } });

        if (!product) { 
            return res.status(404).json({ error: "Product not found" });
        }

        if (product.recommended) {
            product.recommended = false;
            await productRepository.save(product);
            return res.status(200).json({ message: "Product removed from recommended", id:product.id });
        }

        product.recommended = true;
        await productRepository.save(product);

        return res.status(200).json({ message: "Product added to recommended", id: product.id });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const togglePopularProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        let { productIds } = req.body;

        if (!Array.isArray(productIds)) {
            productIds = [productIds];
        }

        if (!productIds || productIds.length === 0) {
            return res.status(400).json({
                data: null,
                error: "productIds is required",
                status: 400
            });
        }

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
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const deletePopularProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        console.log(id)
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const popularProduct = await popularProductRepository.findOne({ where: { id: id } });

        if (!popularProduct) {
            return res.status(404).json({ error: "Popular product not found" });
        }

        await popularProductRepository.delete(popularProduct);

        return res.status(200).json({ message: "Popular product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

