import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Banner } from '../../entities/banner.entity';
import { IsNull } from 'typeorm';

const bannerRepository = AppDataSource.getRepository(Banner);

export const getBanners = async (req: Request, res: Response): Promise<any> => {
    try {
        const banners = await bannerRepository.find({
            where: { deletedAt: IsNull() },
            order: { createdAt: "DESC" },
            select: {
                id: true,
                imagePath: true,
                redirectUrl: true,
                routePath: true,
            }
        });

        if(banners.length === 0){
            return res.status(404).json({message:"No one banners found"})
        }
        return res.status(200).json({ data: banners, error: null, status: 200 });
    } catch (error) {
        console.error("Get Banners Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getBannerById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const banner = await bannerRepository.findOne({
            where: { id, deletedAt: IsNull() }
        });

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        return res.status(200).json({ data: banner, error: null, status: 200 });
    } catch (error) {
        console.error("Get Banner By ID Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
