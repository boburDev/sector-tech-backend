import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

interface CustomError extends Error {
    status?: number;
}

const logDir = "./logs";
const logFilePath = path.join(logDir, "errors.log");

const logErrorToFile = (errorData: object) => {
    try {
        let logArray: object[] = [];

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, "[]", "utf-8");
        }

        const fileContent = fs.readFileSync(logFilePath, "utf-8");
        logArray = fileContent.trim() ? JSON.parse(fileContent) : [];

        if (!Array.isArray(logArray)) logArray = [];

        const newErrorEntry = {
            id: logArray.length + 1,
            ...errorData,
            resolvedAt: null,
        };

        logArray.push(newErrorEntry);

        fs.writeFileSync(logFilePath, JSON.stringify(logArray, null, 2), "utf-8");
    } catch (err) {
        console.error("Failed to write error log:", err);
    }
};


const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    const errorEntry = {
        createdAt: new Date().toISOString(),
        status,
        error: message,
        method: req.method,
        url: req.url,
        stack: err.stack || "No stack trace available",
        fullError: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    };

    logErrorToFile(errorEntry);

    res.status(status).json({
        success: false,
        message,
    });
};


export default errorMiddleware;
