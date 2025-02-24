import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Product } from '../../entities/products.entity';
import { IsNull } from 'typeorm';
import { productSchema } from '../../validators/product.validator';
import { createSlug } from '../../utils/slug';
import { deleteFile } from '../../middlewares/removeFiltePath';

const productRepository = AppDataSource.getRepository(Product);

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
      },
      where: {
        deletedAt: IsNull(),
      },
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

    if (!product) res.json({ data: '', error: null, status: 200 })

  
    res.json({
        data: product,
        error: null,
        status: 200
    });

    if (!product) {
        return res.status(404).json({
            data: null,
            error: 'Product not found',
            status: 404
        });
    }

    res.json(product);
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
        const images = productImages.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));
        const descImages = fullDescriptionImages.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));

        const product = new Product();
        product.title = value.title;
        product.slug = createSlug(value.title);
        product.articul = value.articul || product.articul;
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
        product.mainImage = images[0]
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




