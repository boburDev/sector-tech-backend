import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { CustomError } from "../error-handling/error-handling";

const logDir = "./logs";
const logFilePath = path.join(logDir, "errors.log");
const nginxErrorLogPath = "/var/log/nginx/error.log"; // Update if needed

const getLastNginxErrors = (lines: number = 2): string[] => {
    try {
        if (fs.existsSync(nginxErrorLogPath)) {
            const output = execSync(`tail -n ${lines} ${nginxErrorLogPath}`).toString();
            return output.trim().split("\n");
        }
    } catch (err) {
        console.error("Failed to read Nginx error log:", err);
    }
    return [];
};

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

        // Get last 2 Nginx errors
        const nginxErrors = getLastNginxErrors(2);

        const newErrorEntry = {
            id: logArray.length + 1,
            ...errorData,
            resolvedAt: null,
            nginxErrors: nginxErrors.length ? nginxErrors : "No recent Nginx errors",
        };

        logArray.push(newErrorEntry);

        fs.writeFileSync(logFilePath, JSON.stringify(logArray, null, 2), "utf-8");
    } catch (err) {
        console.error("Failed to write error log:", err);
    }
};

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const isCustomError = err instanceof CustomError;
    const status = isCustomError ? (err as CustomError).status : 500;
    const message = err.message || "Internal Server Error";

    if (![400].includes(status)) {
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
    }

    res.status(status).json({
        status,
        message,
    });
};

export default errorMiddleware;
