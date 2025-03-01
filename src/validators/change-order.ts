import Joi from "joi";

export const changeOrderBodySchema = Joi.object({
    id: Joi.string().required(),
    index: Joi.number().required()
});
    

export const changeOrderQuerySchema = Joi.object({
    name: Joi.string().required().valid('catalog', 'subcatalog', 'category', 'brand', 'popularBrand', 'popularCategory', 'popularProduct')
});

