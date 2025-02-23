import Joi from "joi";

export const productCommentSchema = Joi.object({
  commentBody: Joi.string().min(3).max(500).required().messages({
    "string.base": "Comment body must be a string",
    "string.empty": "Comment body is required",
    "string.min": "Comment body must be at least 3 characters",
    "string.max": "Comment body must be less than 500 characters",
    "any.required": "Comment body is required",
  }),

  star: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Star rating must be a number",
    "number.integer": "Star rating must be an integer",
    "number.min": "Star rating must be at least 1",
    "number.max": "Star rating cannot be more than 5",
    "any.required": "Star rating is required",
  }),

  productId: Joi.string().uuid().required().messages({
    "string.base": "Product ID must be a string",
    "string.guid": "Product ID must be a valid UUID",
    "any.required": "Product ID is required",
  }),

  userId: Joi.string().uuid().required().messages({
    "string.base": "User ID must be a string",
    "string.guid": "User ID must be a valid UUID",
    "any.required": "User ID is required",
  }),
});

export const productQuestionSchema = Joi.object({
  body: Joi.string().min(3).max(500).required().messages({
    "string.base": "Comment body must be a string",
    "string.empty": "Comment body is required",
    "string.min": "Comment body must be at least 3 characters",
    "string.max": "Comment body must be less than 500 characters",
    "any.required": "Comment body is required",
  }),
  productId: Joi.string().uuid().required().messages({
    "string.base": "Product ID must be a string",
    "string.guid": "Product ID must be a valid UUID",
    "any.required": "Product ID is required",
  }),

  userId: Joi.string().uuid().required().messages({
    "string.base": "User ID must be a string",
    "string.guid": "User ID must be a valid UUID",
    "any.required": "User ID is required",
  }),
});


export const productIdParamsSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    "string.base": "Product ID must be a string",
    "string.guid": "Product ID must be a valid UUID",
    "any.required": "Product ID is required",
  }),
});