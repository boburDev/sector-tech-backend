import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Promotion } from '../../entities/promotion.entity';
import { IsNull } from 'typeorm';

const promotionRepository = AppDataSource.getRepository(Promotion);

export const getPromotions = async (req: Request, res: Response): Promise<any> => {
    try {
        const promotions = await promotionRepository.find({ where: { deletedAt: IsNull() } });
        if (promotions.length === 0) {
            return res.status(200).json({ message: 'No promotions found' });
        }
        return res.status(200).json(promotions);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPromotionById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const promotion = await promotionRepository.findOne({ where: { id, deletedAt: IsNull() } });
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        return res.status(200).json({ data: promotion, error: null, status: 200 });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
