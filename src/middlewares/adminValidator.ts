import { NextFunction, Request, Response } from 'express';
import { verify } from '../utils/jwt';

declare global {
    namespace Express {
        interface Request {
            admin?: any;
        }
    }
}

export function validateAdminToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' })
        return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = verify(token);
    
    if (!decoded) {
        res.status(401).json({ message: 'Invalid or expired token' })
        return;
    }

    req.admin = decoded;

    next();
}
