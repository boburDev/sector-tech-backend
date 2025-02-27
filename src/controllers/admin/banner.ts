import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Banner } from '../../entities/banner.entity';
import { IsNull } from 'typeorm';

const bannerRepository = AppDataSource.getRepository(Banner);

export const createBanner = async (req: Request, res: Response): Promise<any> => {
    try {
        const { webPage, url } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        console.log("Received files:", req.files);

        if (!webPage || !url || !files || !files.bannerImages) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const imagePaths = files.bannerImages.map((file) => file.path);

        const newBanner = bannerRepository.create({
            webPage,
            url,
            imagesPath: imagePaths 
        });

        await bannerRepository.save(newBanner);

        return res.status(201).json({ message: "Banner created successfully", data: newBanner });
    } catch (error) {
        console.error("Create Banner Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getBanners = async (req: Request, res: Response): Promise<any> => {
    try {
        const banners = await bannerRepository.find({
            where: { deletedAt: IsNull() },
            order: { createdAt: "DESC" },
            select: {
                id: true,
                imagesPath: true,
                url: true,
                webPage: true,
            }
        });

        if(banners.length === 0){
            return res.status(404).json({message:"No one banners found"})
        }
        return res.status(200).json({ data: banners, error: null, status: 200 });
    } catch (error) {
        console.error("Get Banners Error:", error);
        return res.status(500).json({ message: "Internal server error" });
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
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBanner = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { imagePath, webPage, url } = req.body;

        const banner = await bannerRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        banner.imagesPath = imagePath || banner.imagesPath;
        banner.webPage = webPage || banner.webPage;
        banner.url = url || banner.url;

        await bannerRepository.save(banner);

        return res.status(200).json({ data: banner, message: "Banner updated successfully" });
    } catch (error) {
        console.error("Update Banner Error:", error);
        return res.status(500).json({ message: "Internal server error" });
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
        return res.status(500).json({ message: "Internal server error" });
    }
};
