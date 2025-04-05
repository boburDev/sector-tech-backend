import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export const validate = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error } = schema.validate(req.body, { abortEarly: false });

            if (error) {
                throw error
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};


export const validateParams = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const { error } = schema.validate(req.params, { abortEarly: false });

            if (error) {
                throw error
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

export const validateQuery = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const { error } = schema.validate(req.query, { abortEarly: false });

            if (error) {
                throw error
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};


