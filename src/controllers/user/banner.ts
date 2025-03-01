import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Banner } from '../../entities/banner.entity';
import { IsNull } from 'typeorm';

const bannerRepository = AppDataSource.getRepository(Banner);

export const getBanners = async (req: Request, res: Response): Promise<any> => {
    try {
        const { routePath } = req.query;

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

        if (banners.length === 0) {
            return res.status(404).json({ message: "No banners found" });
        }

        return res.status(200).json({ data: banners, error: null, status: 200 });
    } catch (error) {
        console.error("Get Banners Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

