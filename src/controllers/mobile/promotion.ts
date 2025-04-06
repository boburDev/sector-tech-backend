import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Promotion } from '../../entities/promotion.entity';
import { IsNull } from 'typeorm';
import { CustomError } from '../../error-handling/error-handling';
const promotionRepository = AppDataSource.getRepository(Promotion);

export const getPromotions = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const promotions = await promotionRepository.find({
            where: { deletedAt: IsNull() },
            select: {
            id: true,
            title: true,
            coverImage: true,
            slug: true,
            expireDate: true
        } });
        return res.status(200).json({ data: promotions, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const getPromotionById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const promotion = await promotionRepository.findOne({ where: { id, deletedAt: IsNull() } });
        if (!promotion) throw new CustomError('Promotion not found', 404);
        return res.status(200).json({ data: promotion, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};
