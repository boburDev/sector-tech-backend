import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const logDir = "./logs";
const logFilePath = path.join(logDir, "errors.log");

const ensureLogFileExists = () => {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, "[]", "utf-8");
    }
};

const readLogs = (): any[] => {
    ensureLogFileExists();
    const fileContent = fs.readFileSync(logFilePath, "utf-8");
    return fileContent.trim() ? JSON.parse(fileContent) : [];
};

const writeLogs = (logs: any[]) => {
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), "utf-8");
};

export const getAllLogs = (req: Request, res: Response) => {
    const logs = readLogs();
    res.json({ success: true, logs });
};

export const getLogById = (req: Request, res: Response) => {
    const logs = readLogs();
    const log = logs.find((l) => l.id === parseInt(req.params.id));

    if (!log) {
        res.status(404).json({ success: false, message: "Log not found" });
    }

    res.json({ success: true, log });
};

export const resolveLog = (req: Request, res: Response) => {
    const logs = readLogs();
    const logIndex = logs.findIndex((l) => l.id === parseInt(req.params.id));

    if (logIndex === -1) {
        res.status(404).json({ success: false, message: "Log not found" });
    }

    logs[logIndex].resolvedAt = new Date().toISOString();
    writeLogs(logs);

    res.json({ success: true, message: "Log resolved", log: logs[logIndex] });
};

export const deleteLog = (req: Request, res: Response) => {
    let logs = readLogs();
    const logIndex = logs.findIndex((l) => l.id === parseInt(req.params.id));

    if (logIndex === -1) {
        res.status(404).json({ success: false, message: "Log not found" });
    }

    logs.splice(logIndex, 1);
    writeLogs(logs);

    res.json({ success: true, message: "Log deleted" });
};
