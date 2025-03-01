import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export const validate = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
       const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details.map((err) => err.message),
            });
            return;
        }
        next();
    };
};


export const validateParams = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.params, { abortEarly: false });

        if (error) {
            res.status(400).json({
                success: false,
                message: "Params validation error",
                error: error.details.map((err) => err.message),
            });
            return;
        }

        next();
    };
};

export const validateQuery = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.query, { abortEarly: false });

        if (error) {
            res.status(400).json({
                success: false,
                message: "Query validation error",
                error: error.details.map((err) => err.message),
                    }); 
            return;
        }

        next();
        };  
};


