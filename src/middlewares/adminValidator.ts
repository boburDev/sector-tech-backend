import { NextFunction, Request, Response } from 'express';
import { verify } from '../utils/jwt';
import AppDataSource from '../config/ormconfig';
import { Admin } from '../entities/admin.entity';

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
        res.status(401).json({ message: 'No token provided' })
        return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = verify(token);
    
    if (!decoded) {
        res.status(401).json({ message: 'Invalid or expired token' })
        return;
    }

    const existingAdmin = await adminRepository.findOne({ where: { username: decoded.username, id: decoded.id } });
	
    if (!existingAdmin) {
        res.status(401).json({ message: 'Admin not found' })
        return;
    }

    if (existingAdmin && existingAdmin.status !== 'active') {
        res.status(400).json({ message: 'Your account is not active' });
        return;
    }
    
    req.admin = {
        id: existingAdmin.id,
        username: existingAdmin.username,
        role: existingAdmin.role,
        status: existingAdmin.status
    };
    next();

}

