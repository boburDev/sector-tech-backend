import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Product } from '../../entities/products.entity';
import { IsNull } from 'typeorm';
import { productSchema } from '../../validators/product.validator';
import { createSlug } from '../../utils/slug';
import { deleteFile } from '../../middlewares/removeFiltePath';
import { Brand } from '../../entities/brands.entity';
import { ProductCondition, ProductRelevance } from '../../entities/product_details.entity';
import { Catalog, Category, Subcatalog } from '../../entities/catalog.entity';

const productRepository = AppDataSource.getRepository(Product);
const brandRepository = AppDataSource.getRepository(Brand);
const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const productRelevanceRepository = AppDataSource.getRepository(ProductRelevance);
const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);

export const getProducts = async (req: Request, res: Response): Promise<any> => {
    const products = await productRepository.find({
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
            characteristics: true,
            fullDescriptionImages: true,
            images: true,
            brandId: true,
            catalogId: true,
            categoryId: true,
            conditionId: true,
            createdAt: true,
            deletedAt: true,
            relevanceId: true,
            subcatalogId: true,
        },
        where: {
            deletedAt: IsNull(),
        },
        relations: [
            "brand",
            "conditions",
            "relevances",
            "catalog",
            "subcatalog",
            "category",
            "questions",
            "comments",
        ],
    });

    res.json({
        data: products,
        error: null,
        status: 200
    });
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
    
    const productImages = files["productImages"] || [];
    const fullDescriptionImages = files["fullDescriptionImages"] || [];
    
    try {
        const { error, value } = productSchema.validate(req.body);

        if (error) {
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
        const mainImage = images.splice(0,1)[0]
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
        product.fullDescriptionImages = descImages;
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
        productImages.forEach(file => {
            deleteFile(file.path)
        });
        fullDescriptionImages.forEach(file => {
            deleteFile(file.path)
        });

        return res.status(500).json({ error: "Internal server error" });
    }
};