import Joi from "joi";

export const productConditionSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title must not exceed 100 characters",
        "any.required": "Title is required"
    }),
    name: Joi.string().min(3).max(100).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must not exceed 100 characters",
        "any.required": "Name is required"
    })
});

export const validationByName = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must not exceed 100 characters",
        "any.required": "Name is required"
    })
});

export const replyToCommentSchema = Joi.object({
    commentId: Joi.string().uuid().required().messages({
        "string.base": "Comment ID must be a string",
        "string.empty": "Comment ID cannot be empty",
        "string.guid": "Comment ID must be a valid UUID",
        "any.required": "Comment ID is required"
    }),
    message: Joi.string().min(3).max(500).required().messages({
        "string.base": "Message must be a string",
        "string.empty": "Message cannot be empty",
        "string.min": "Message must be at least 3 characters long",
        "string.max": "Message must not exceed 500 characters",
        "any.required": "Message is required"
    }),
});

export const replyToQuestionSchema = Joi.object({
    questionId: Joi.string().uuid().required().messages({
        "string.base": "Question ID must be a string",
        "string.empty": "Question ID cannot be empty",
        "string.guid": "Question ID must be a valid UUID",
        "any.required": "Question ID is required"
    }),
    message: Joi.string().min(3).max(500).required().messages({
        "string.base": "Message must be a string",
        "string.empty": "Message cannot be empty",
        "string.min": "Message must be at least 3 characters long",
        "string.max": "Message must not exceed 500 characters",
        "any.required": "Message is required"
    }),
});
