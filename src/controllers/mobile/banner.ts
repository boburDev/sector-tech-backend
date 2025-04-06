import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Banner } from '../../entities/banner.entity';
import { IsNull } from 'typeorm';
import { CustomError } from '../../error-handling/error-handling';
const bannerRepository = AppDataSource.getRepository(Banner);

export const getBanners = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { routePath } = req.query;

        if (!routePath) throw new CustomError('Query not found', 400);
        const whereCondition: any = { deletedAt: IsNull() };

        if (routePath) {
            whereCondition.routePath = routePath as string;
        }

        const banners = await bannerRepository.find({
            where: whereCondition,
            order: { createdAt: "DESC" },
            select: {
                id: true,
                imagePath: true,
                redirectUrl: true,
                routePath: true,
            }
        });

        return res.status(200).json({ data: banners, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

