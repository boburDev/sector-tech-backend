import { NextFunction, Request, Response } from 'express';
import { verify } from '../utils/jwt';
import AppDataSource from '../config/ormconfig';
import { Users } from '../entities/user.entity';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


const userRepository = AppDataSource.getRepository(Users);

export async function validateUserToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' })
        return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = verify(token, 'user');

    if (!decoded) {
        res.status(401).json({ message: 'Invalid or expired token' })
        return;
    }

    const existingUser = await userRepository.findOne({ where: { email: decoded.email, id: decoded.id } });
	
    if (!existingUser) {
        res.status(401).json({ message: 'User not found' })
        return;
    }

    req.user = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email
    };
    next();

}

