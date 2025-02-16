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
