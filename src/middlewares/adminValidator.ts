import { NextFunction, Request, Response } from 'express';
import { verify } from '../utils/jwt';
import AppDataSource from '../config/ormconfig';
import { Admin } from '../entities/admin.entity';
import { IsNull } from 'typeorm';
import { CustomError } from '../error-handling/error-handling';

declare global {
    namespace Express {
        interface Request {
            admin?: any;
        }
    }
}


const adminRepository = AppDataSource.getRepository(Admin);

export async function validateAdminToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new CustomError("No token provided", 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = verify(token);

    if (!decoded) {
        throw new CustomError("Invalid or expired token", 401);
    }

    const existingAdmin = await adminRepository.findOne({ where: { username: decoded.username, id: decoded.id, deletedAt: IsNull() } });
	
    if (!existingAdmin) {
        throw new CustomError("Admin not found", 401);
    }

    if (existingAdmin && existingAdmin.status !== 'active') {
        throw new CustomError("Your account is not active", 400);
    }

    req.admin = {
        id: existingAdmin.id,
        username: existingAdmin.username,
        role: existingAdmin.role,
        status: existingAdmin.status
    };
    next();
}

