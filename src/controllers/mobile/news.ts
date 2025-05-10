import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../config/ormconfig";
import { News } from "../../entities/news.entity";
import { CustomError } from "../../error-handling/error-handling";
import { IsNull } from "typeorm";

const newsRepository = AppDataSource.getRepository(News);

export const getAllNews = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { home } = req.query;
        if(home){
            const news = await newsRepository.find({
                where: { deletedAt: IsNull() },
                order: {
                    createdAt: "DESC"
                },
                take: 2,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    fullDescription: true,
                    fullDescriptionImages: true,
                    slug: true,
                    createdAt: true
                }
            });
    
            return res.status(200).json({
                status: 200,
                message: "News retrieved successfully",
                data: news
            });
        }
        
        const news = await newsRepository.find({
            where: { deletedAt: IsNull() },
            order: {
                createdAt: "DESC"
            },
            select: {
                id: true,
                title: true,
                description: true,
                fullDescription: true,
                fullDescriptionImages: true,
                slug: true,
                createdAt: true
            }
        });

        return res.status(200).json({
            status: 200,
            message: "News retrieved successfully",
            data: news
        });
    } catch (error) {
        next(error);
    }
};

export const getNewsBySlug = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { slug } = req.params;

        const news = await newsRepository.findOne({ 
            where: { 
            slug, deletedAt: IsNull() }, 
            order: {
                createdAt: "DESC"
            },
            select: {
                id: true,
                title: true,
                description: true,
                fullDescription: true,
                fullDescriptionImages: true,
                slug: true,
                createdAt: true
        } });
        if (!news) throw new CustomError("News not found", 404);

        return res.status(200).json({
            status: 200,
            message: "News retrieved successfully",
            data: news
        });
    } catch (error) {
        next(error);
    }
};
