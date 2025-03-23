import { NextFunction, Request, Response } from 'express';
import { verify } from '../utils/jwt';
import AppDataSource from '../config/ormconfig';
import { Users } from '../entities/user.entity';
import { CustomError } from '../error-handling/error-handling';
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
        throw new CustomError("No token provided", 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = verify(token, 'user');

    if (!decoded) {
        throw new CustomError("Invalid or expired token", 401);
    }

    const existingUser = await userRepository.findOne({ where: { email: decoded.email, id: decoded.id } });
	
    if (!existingUser) {
        throw new CustomError("User not found", 401);
    }

    req.user = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email
    };
    next();

}