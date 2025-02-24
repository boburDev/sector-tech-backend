import Joi from "joi";

export const catalogSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must not exceed 100 characters",
    "any.required": "Title is required",
  }),
});


export const categoryIdsSchema = Joi.object({
  categoryIds: Joi.array()
    .items(
      Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required()
    )
    .min(1)
    .required()
    .messages({
      "array.base": "categoryIds must be an array",
      "array.min": "At least one categoryId is required",
      "string.guid": "Each categoryId must be a valid UUID",
      "any.required": "categoryIds is required",
    }),
});
export const brandIdsSchema = Joi.object({
  brandIds: Joi.array()
    .items(
      Joi.string()
        .guid({ version: ["uuidv4", "uuidv5"] })
        .required()
    )
    .min(1)
    .required()
    .messages({
      "array.base": "brandIds must be an array",
      "array.min": "At least one brandIds is required",
      "string.guid": "Each brandIds must be a valid UUID",
      "any.required": "brandIds is required",
    }),
});
