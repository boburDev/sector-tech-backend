import Joi from "joi";

export const productSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    articul: Joi.string().min(1).max(50).required(),
    productCode: Joi.string().min(1).max(50).required(),
    characteristics: Joi.string().required(),
    description: Joi.string().min(0).max(1000).required(),
    fullDescription: Joi.string().min(0).required(),
    price: Joi.number().min(0).required(),
    inStock: Joi.string().required(),
    brandId: Joi.string().uuid().required(),
    conditionId: Joi.string().uuid().required(),
    relevanceId: Joi.string().uuid().required(),
    catalogId: Joi.string().uuid().required(),
    subcatalogId: Joi.string().uuid().required(),
    categoryId: Joi.string().uuid().required(),
    garanteeIds: Joi.string().optional(),
});

export const productFunctionalSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    articul: Joi.string().min(1).max(50).required(),
    productCode: Joi.string().min(1).max(50).required(),
    characteristics: Joi.string().required(),
    description: Joi.string().min(0).max(1000).required(),
    fullDescription: Joi.string().min(0).required(),
    price: Joi.number().min(0).required(),
    inStock: Joi.string().required(),
    brandId: Joi.string().uuid().required(),
    conditionId: Joi.string().uuid().required(),
    relevanceId: Joi.string().uuid().required(),
    catalogId: Joi.string().uuid().required(),
    subcatalogId: Joi.string().uuid().required(),
    categoryId: Joi.string().uuid().required(),
    garanteeIds: Joi.string().optional(),
    images: Joi.array()
});
