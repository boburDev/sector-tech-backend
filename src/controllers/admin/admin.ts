import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Admin } from '../../entities/admin.entity';
import { sign } from '../../utils/jwt';
import { IsNull } from 'typeorm';
import { Users } from '../../entities/user.entity';
import { CustomError } from '../../error-handling/error-handling';
const adminRepository = AppDataSource.getRepository(Admin);
const userRepository = AppDataSource.getRepository(Users);

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, password } = req.body;

        const admin = await adminRepository.findOne({ where: { username } });
        
        if (!admin) throw new CustomError('Invalid credentials', 401);

        if (admin.status === 'inactive') throw new CustomError('Account is inactive', 401);

        const isValidPassword = await admin.validatePassword(password);

        if (!isValidPassword) throw new CustomError('Invalid credentials', 401);

        const token = sign(
            { id: admin.id, username: admin.username, role: admin.role },
            86400000 // 1 day in milliseconds
        );

        return res.json({ 
            id: admin.id,
            username: admin.username,
            status: admin.status,
            role: admin.role,
            token 
        });

    } catch (error) {
        next(error);
    }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, password, role, status } = req.body;
               
        if (req.admin.role !== 'super') throw new CustomError('Your account is not active or you are not a super admin', 400);

        if (req.admin.username === username) throw new CustomError('Username already exists', 400);

        const admin = new Admin();
        admin.username = username;
        admin.password = password;
        admin.role = role || 'admin';
        admin.status = status || 'active';

        const savedAdmin = await adminRepository.save(admin);

        return res.status(201).json({ 
            username: savedAdmin.username,
            role: savedAdmin.role,
            status: savedAdmin.status
        });

    } catch (error) {
        next(error);
    }
};

export const getAdmins = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (req.admin.role !== 'super') throw new CustomError('Your account is not active or you are not a super admin', 400);

        const admins = await adminRepository.find({
            where: { deletedAt: IsNull() },
            order: { createdAt: "DESC" },
            select: {
                id: true,
                username: true,
                role: true,
                status: true
            }
        });

        return res.json({
            data: admins,
            error: null,
            status: 200
        });

    } catch (error) {
        next(error);
    }
};

export const getAdminById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (req.admin.role !== 'super') throw new CustomError('Your account is not active or you are not a super admin', 400);

        const { id } = req.admin;
        const user = await adminRepository.findOne({ 
            where: { 
                id,
                deletedAt: IsNull()
            } ,
            select: {
                id: true,
                username: true,
                role: true,
                status: true
            }
        });

        if (!user) throw new CustomError('User not found', 404);

        return res.json({
            data: user,
            error: null,
            status: 200
        });

    } catch (error) {
        next(error);
    }
};

export const updateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (req.admin.role !== 'super') throw new CustomError('Your account is not active or you are not a super admin', 400);

        const { id } = req.admin;
        const { username, role, status } = req.body;

        const user = await adminRepository.findOne({ 
            where: { 
                id,
                deletedAt: IsNull()
            }
        });

        if (!user) throw new CustomError('User not found', 404);

        if (username) user.username = username;
        if (role) user.role = role;
        if (status) user.status = status;

        const updatedUser = await adminRepository.save(user);

        return res.json({
            data: {
                id: updatedUser.id,
                username: updatedUser.username,
                role: updatedUser.role,
                status: updatedUser.status
            },
            error: null,
            status: 200
        });

    } catch (error) {
        next(error);
    }
};

export const deleteAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (req.admin.role !== 'super') throw new CustomError('Your account is not active or you are not a super admin', 400);

        const { id } = req.admin;
        const user = await adminRepository.findOne({ 
            where: { 
                id,
                deletedAt: IsNull()
            } 
        });

        if (!user) throw new CustomError('User not found', 404);

        if (user.id === req.admin.id) throw new CustomError('Cannot delete your own account', 400);

        if (user.role === 'super') throw new CustomError('Cannot delete super admin account', 400);

        user.deletedAt = new Date();
        await adminRepository.save(user);

        return res.json({
            data: 'Admin deleted successfully',
            error: null,
            status: 200
        });

    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const users = await userRepository.find({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            }
        });
        return res.json({
            data: users,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};