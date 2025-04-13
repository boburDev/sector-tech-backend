import Joi from "joi";

export const createKontragentAddressSchema = Joi.object({
    fullAddress: Joi.string().required(),
    country: Joi.string().required(),
    region: Joi.string().required(),
    district: Joi.string().required(),
    street: Joi.string().required(),
    house: Joi.string().required(),
    apartment: Joi.string().optional(),
    index: Joi.string().required(),
    comment: Joi.string().optional(),
    isMain: Joi.boolean().optional(),
});
