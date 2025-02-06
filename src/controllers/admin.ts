import { Request, Response } from 'express';
import AppDataSource from '../config/ormconfig';
import { Admin } from '../entities/admin.entity';
import { sign } from '../utils/jwt';

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

        const existingAdmin = await adminRepository.findOne({ where: { username } });
        
        if (existingAdmin) {
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
