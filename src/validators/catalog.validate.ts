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
