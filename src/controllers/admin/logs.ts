import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { CustomError } from "../../error-handling/error-handling";
import { execSync } from "child_process";

const logDir = "./logs";
const logFilePath = path.join(logDir, "errors.log");
const nginxErrorLogPath = "/var/log/nginx/error.log"; // Ensure correct path

const ensureLogFileExists = () => {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, "[]", "utf-8");
    }
};

const getLastNginxErrors = (lines: number = 10): string[] => {
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

const readLogs = (): any[] => {
    ensureLogFileExists();
    const fileContent = fs.readFileSync(logFilePath, "utf-8");
    return fileContent.trim() ? [...JSON.parse(fileContent)].reverse() : [];
};

const writeLogs = (logs: any[]) => {
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), "utf-8");
};

export const getAllLogs = (req: Request, res: Response) => {
    const logs = readLogs();
    const nginxErrors = getLastNginxErrors(2);

    res.json({ success: true, nginxErrors, logs });
};

export const getLogById = (req: Request, res: Response) => {
    const logs = readLogs();
    const log = logs.find((l) => l.id === parseInt(req.params.id));

    if (!log) throw new CustomError('Log not found', 404);

    res.json({ success: true, log });
};

export const resolveLog = (req: Request, res: Response) => {
    const logs = readLogs();
    const logIndex = logs.findIndex((l) => l.id === parseInt(req.params.id));

    if (logIndex === -1) throw new CustomError('Log not found', 404);

    logs[logIndex].resolvedAt = new Date().toISOString();
    writeLogs(logs);

    res.json({ success: true, message: "Log resolved", log: logs[logIndex] });
};

export const deleteLog = (req: Request, res: Response) => {
    let logs = readLogs();
    const logIndex = logs.findIndex((l) => l.id === parseInt(req.params.id));

    if (logIndex === -1) throw new CustomError('Log not found', 404);

    logs.splice(logIndex, 1);
    writeLogs(logs);

    res.json({ success: true, message: "Log deleted" });
};
