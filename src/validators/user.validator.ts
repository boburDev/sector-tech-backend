import Joi from "joi";

export const userSchemaValidator = Joi.object({
    email: Joi.string().email().required(),
    optCode: Joi.string().required(),
});



