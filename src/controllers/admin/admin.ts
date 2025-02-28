import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Admin } from '../../entities/admin.entity';
import { sign } from '../../utils/jwt';
import { IsNull } from 'typeorm';
import { Users } from '../../entities/user.entity';

const adminRepository = AppDataSource.getRepository(Admin);
const userRepository = AppDataSource.getRepository(Users);

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;

        const admin = await adminRepository.findOne({ where: { username } });
        
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (admin.status === 'inactive') {
            return res.status(401).json({ message: 'Account is inactive' });
        }

        const isValidPassword = await admin.validatePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

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
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
};

export const createAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password, role, status } = req.body;
               
        if (req.admin.role !== 'super') {
            return res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
        }

        if (req.admin.username === username) {
            return res.status(400).json({ message: 'Username already exists' });
        }

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
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
};

export const getAdmins = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.admin.role !== 'super') {
            return res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
        }

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
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAdminById = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.admin.role !== 'super') {
            return res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
        }

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

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({
            data: user,
            error: null,
            status: 200
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.admin.role !== 'super') {
            return res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
        }

        const { id } = req.admin;
        const { username, role, status } = req.body;

        const user = await adminRepository.findOne({ 
            where: { 
                id,
                deletedAt: IsNull()
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

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
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.admin.role !== 'super') {
            return res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
        }

        const { id } = req.admin;
        const user = await adminRepository.findOne({ 
            where: { 
                id,
                deletedAt: IsNull()
            } 
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.id === req.admin.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        if (user.role === 'super') {
            return res.status(400).json({ message: 'Cannot delete super admin account' });
        }

        user.deletedAt = new Date();
        await adminRepository.save(user);

        return res.json({
            data: 'Admin deleted successfully',
            error: null,
            status: 200
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await userRepository.find();
        return res.json({
            data: users,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};