import Joi from "joi";

export const createRequestValidation = Joi.object({
  topicCategory: Joi.string().required().max(255),
  topic: Joi.string().required().max(255),
  fullName: Joi.string().required().max(100),   
  email: Joi.string().email().required().max(100),
  orderNumber: Joi.string().optional().max(50),
  description: Joi.string().required(),
});


