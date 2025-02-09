import { Request, Response } from 'express';
import AppDataSource from '../config/ormconfig';
import { Admin } from '../entities/admin.entity';
import { sign } from '../utils/jwt';
import { IsNull } from 'typeorm';

const adminRepository = AppDataSource.getRepository(Admin);

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const admin = await adminRepository.findOne({ where: { username } });
        
        if (!admin) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        if (admin.status === 'inactive') {
            res.status(401).json({ message: 'Account is inactive' });
            return;
        }

        const isValidPassword = await admin.validatePassword(password);

        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = sign(
            { id: admin.id, username: admin.username, role: admin.role },
            86400000 // 1 day in milliseconds
        );

        res.json({ 
            id: admin.id,
            username: admin.username,
            status: admin.status,
            role: admin.role,
            token 
        });
        return;

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password, role, status } = req.body;
               
        if (req.admin.role !== 'super') {
            res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
            return;
        }

        if (req.admin.username === username) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        const admin = new Admin();
        admin.username = username;
        admin.password = password;
        admin.role = role || 'admin';
        admin.status = status || 'active';

        const savedAdmin = await adminRepository.save(admin);

        res.status(201).json({ 
            username: savedAdmin.username,
            role: savedAdmin.role,
            status: savedAdmin.status
        });
        return;

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        if (req.admin.role !== 'super') {
            res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
            return;
        }

        const users = await adminRepository.find({
            where: { deletedAt: IsNull() }
        });

        const sanitizedUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            role: user.role,
            status: user.status
        }));

        res.json({
            data: sanitizedUsers,
            error: null,
            status: 200
        });
        return;

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        if (req.admin.role !== 'super') {
            res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
            return;
        }

        const { id } = req.params;
        const user = await adminRepository.findOne({ 
            where: { 
                id,
                deletedAt: IsNull()
            } 
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            data: {
                id: user.id,
                username: user.username,
                role: user.role,
                status: user.status
            },
            error: null,
            status: 200
        });
        return;

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        if (req.admin.role !== 'super') {
            res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
            return;
        }

        const { id } = req.params;
        const { username, role, status } = req.body;

        const user = await adminRepository.findOne({ 
            where: { 
                id,
                deletedAt: IsNull()
            } 
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (username) user.username = username;
        if (role) user.role = role;
        if (status) user.status = status;

        const updatedUser = await adminRepository.save(user);

        res.json({
            data: {
                id: updatedUser.id,
                username: updatedUser.username,
                role: updatedUser.role,
                status: updatedUser.status
            },
            error: null,
            status: 200
        });
        return;

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (req.admin.role !== 'super') {
            res.status(400).json({ message: 'Your account is not active or you are not a super admin' });
            return;
        }

        const { id } = req.params;
        const user = await adminRepository.findOne({ 
            where: { 
                id,
                deletedAt: IsNull()
            } 
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.id === req.admin.id) {
            res.status(400).json({ message: 'Cannot delete your own account' });
            return;
        }

        if (user.role === 'super') {
            res.status(400).json({ message: 'Cannot delete super admin account' });
            return;
        }

        user.deletedAt = new Date();
        await adminRepository.save(user);

        res.json({
            data: 'User deleted successfully',
            error: null,
            status: 200
        });
        return;

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
