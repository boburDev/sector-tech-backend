import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Banner } from '../../entities/banner.entity';
import { IsNull } from 'typeorm';
import { deleteFile } from '../../middlewares/removeFiltePath';

const bannerRepository = AppDataSource.getRepository(Banner);

export const createBanner = async (req: Request, res: Response): Promise<any> => {
    try {
        const { routePath, redirectUrl } = req.body;
        const file = req.file as Express.Multer.File;

        if (!redirectUrl || !routePath || !file) {
            return res.json({
                data: null,
                error: 'All fields are required',
                status: 400
            });
        }

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
        console.error("Create Banner Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

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

export const updateBanner = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { routePath, redirectUrl } = req.body;
        const file = req.file as Express.Multer.File;

        const banner = await bannerRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

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
        console.error("Update Banner Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const deleteBanner = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const banner = await bannerRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        banner.deletedAt = new Date();
        await bannerRepository.save(banner);

        return res.status(200).json({ message: "Banner deleted successfully" });
    } catch (error) {
        console.error("Delete Banner Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
