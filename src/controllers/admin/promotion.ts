import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Promotion } from '../../entities/promotion.entity';
import { createSlug } from '../../utils/slug';
import { IsNull } from 'typeorm';
import { deleteFile } from '../../middlewares/removeFiltePath';
import { CustomError } from '../../error-handling/error-handling';
const promotionRepository = AppDataSource.getRepository(Promotion);

export const createPromotion = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { title, expireDate, fullDescription } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const coverImage = files['coverImage'][0];
        const bannerImage = files["promotionBannerImage"][0];
        const fullDescriptionImages = files["promotionDescriptionImages"] || [];
        
        if (!coverImage || !bannerImage || !title || !expireDate) throw new CustomError('coverImage and bannerImage and title and expireDate are required', 400);

        const existsPromotion = await promotionRepository.findOne({ where: { title, deletedAt: IsNull() } });
        if (existsPromotion) throw new CustomError('Promotion already exists', 400);

        const newPromotion = new Promotion()
        newPromotion.title = title;
        newPromotion.coverImage = coverImage.path.replace(/\\/g, "/").replace(/^public\//, "");
        newPromotion.bannerImage = bannerImage.path.replace(/\\/g, "/").replace(/^public\//, "");
        newPromotion.fullDescriptionImages = fullDescriptionImages.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));
        newPromotion.slug = createSlug(title)
        newPromotion.fullDescription = fullDescription;
        newPromotion.expireDate = expireDate;
        let savedProdmotion = await promotionRepository.save(newPromotion);
        const { createdAt, deletedAt, ...promotionData } = savedProdmotion;
        return res.status(201).json({ data: promotionData, message: 'Promotion created successfully' });
    } catch (error) {
        next(error);
    }
};

export const getPromotions = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const promotions = await promotionRepository.find({ where: { deletedAt: IsNull() } });

        return res.status(200).json({data: promotions, error: null, status: 200});
    } catch (error) {
        next(error);
    }
};

export const getPromotionById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const promotion = await promotionRepository.findOne({ where: { id, deletedAt: IsNull() } });
        if (!promotion) throw new CustomError('Promotion not found', 404);
        return res.status(200).json({data: promotion,error: null, status: 200});
    } catch (error) {
        next(error);
    }
};

export const updatePromotion = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { title, expireDate, fullDescription } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const coverImage = files['coverImage'][0] || null;
        const bannerImage = files["promotionBannerImage"][0] || null;
        const fullDescriptionImages = files["promotionDescriptionImages"] || [];
        
        const promotion = await promotionRepository.findOne({ where: { id, deletedAt: IsNull() } });
        if (!promotion) throw new CustomError('Promotion not found', 404);
        if(coverImage){
            deleteFile(promotion.coverImage);
        }
        if(bannerImage){
            deleteFile(promotion.bannerImage);
        }
        if(fullDescriptionImages.length > 0){
            fullDescriptionImages.forEach(file => deleteFile(file.path));
        }
        
        promotion.title = title;
        promotion.coverImage = coverImage.path.replace(/\\/g, "/").replace(/^public\//, "");
        promotion.bannerImage = bannerImage.path.replace(/\\/g, "/").replace(/^public\//, "");
        promotion.fullDescription = fullDescription;
        promotion.expireDate = expireDate;
        promotion.fullDescriptionImages = fullDescriptionImages.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));
        promotion.slug = createSlug(title)
        const updatedPromotion = await promotionRepository.save(promotion);
        const { createdAt, deletedAt, ...promotionData } = updatedPromotion;
        return res.status(200).json({ data: promotionData, message: 'Promotion updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const deletePromotion = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const promotion = await promotionRepository.findOne({ where: { id, deletedAt: IsNull() } });

        if (!promotion) throw new CustomError('Promotion not found', 404);
        promotion.deletedAt = new Date();
        await promotionRepository.save(promotion);
        
        return res.status(204).send({ message: 'Promotion deleted successfully' });
    } catch (error) {
        next(error);
    }
};
