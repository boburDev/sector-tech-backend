import Joi from "joi";

export const adminValidateSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be empty",
    "string.min": "Username should have a minimum length of 3",
    "string.max": "Username should have a maximum length of 30",
    "any.required": "Username is required",
  }),
  password: Joi.string().min(4).max(50).required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should have a minimum length of 6",
    "string.max": "Password should have a maximum length of 50",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("admin", "superadmin").default("admin").messages({
    "any.only": "Role must be either admin or superadmin",
  }),
  status: Joi.string().valid("active", "inactive").default("active").messages({
    "any.only": "Status must be either active or inactive",
  }),
});

export const uuidSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.base": "ID must be a string",
    "string.guid": "ID must be a valid UUID",
    "any.required": "ID is required",
  }),
});

export const adminUpdateValidateSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be empty",
    "string.min": "Username should have a minimum length of 3",
    "string.max": "Username should have a maximum length of 30",
    "any.required": "Username is required",
  }),
  role: Joi.string().valid("admin", "superadmin").default("admin").messages({
    "any.only": "Role must be either admin or superadmin",
  }),
  status: Joi.string().valid("active", "inactive").default("active").messages({
    "any.only": "Status must be either active or inactive",
  }),
});
export const adminLoginValidateSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be empty",
    "string.min": "Username should have a minimum length of 3",
    "string.max": "Username should have a maximum length of 30",
    "any.required": "Username is required",
  }),
  password: Joi.string().min(4).max(50).required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should have a minimum length of 6",
    "string.max": "Password should have a maximum length of 50",
    "any.required": "Password is required",
  }),
});


