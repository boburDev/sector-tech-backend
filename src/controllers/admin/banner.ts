import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Banner } from '../../entities/banner.entity';
import { IsNull } from 'typeorm';
import { deleteFile } from '../../middlewares/removeFiltePath';
import { CustomError } from '../../error-handling/error-handling';
const bannerRepository = AppDataSource.getRepository(Banner);

export const createBanner = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { routePath, redirectUrl } = req.body;
        const file = req.file as Express.Multer.File;

        if (!redirectUrl || !routePath || !file) throw new CustomError('All fields are required', 400);

        const newPath = file.path.replace(/\\/g, "/").replace(/^public\//, "");

        const newBanner = bannerRepository.create({
            routePath,
            redirectUrl,
            imagePath: newPath 
        });

        const savedBanner = await bannerRepository.save(newBanner);
        const { createdAt, deletedAt, ...bannerData } = savedBanner;
        return res.status(201).json({ message: "Banner created successfully", data: bannerData });
    } catch (error) {
        next(error);
    }
};

export const getBanners = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

        return res.status(200).json({ data: banners, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const getBannerById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const banner = await bannerRepository.findOne({
            where: { id, deletedAt: IsNull() }
        });

        if (!banner) throw new CustomError('Banner not found', 404);

        return res.status(200).json({ data: banner, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const updateBanner = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { routePath, redirectUrl } = req.body;
        const file = req.file as Express.Multer.File;

        const banner = await bannerRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!banner) throw new CustomError('Banner not found', 404);

        if (file) {
            deleteFile(banner.imagePath)
            const newPath = file.path.replace(/\\/g, "/").replace(/^public\//, "");
            banner.imagePath = newPath;
        }

        banner.routePath = routePath || banner.routePath;
        banner.redirectUrl = redirectUrl || banner.redirectUrl;

        await bannerRepository.save(banner);

        return res.status(200).json({ data: banner, message: "Banner updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteBanner = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const banner = await bannerRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!banner) throw new CustomError('Banner not found', 404);

        banner.deletedAt = new Date();
        await bannerRepository.save(banner);

        return res.status(200).json({ message: "Banner deleted successfully" });
    } catch (error) {
        next(error);
    }
};
