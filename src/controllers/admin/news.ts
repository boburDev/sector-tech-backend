import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../config/ormconfig";
import { News } from "../../entities/news.entity";
import { createSlug } from "../../utils/slug";
import { CustomError } from "../../error-handling/error-handling";
import { IsNull } from "typeorm";
import { deleteFileBeforeSave } from "../../middlewares/removeFiltePath";

const newsRepository = AppDataSource.getRepository(News);

const normalizePaths = (files: Express.Multer.File[]) =>
    files.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));

export const createNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, fullDescription, createdAt } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const fullDescriptionImages = normalizePaths(files["newsFullDescriptionImages"] || []);

        if (!title || !description || !fullDescription) {
            throw new CustomError("All fields are required", 400);
        }

        const news = newsRepository.create({
            title,
            description,
            fullDescription,
            fullDescriptionImages,
            slug: createSlug(title),
            createdAt: createdAt || new Date()
        });

        await newsRepository.save(news);

        return res.status(201).json({
            status: 201,
            message: "News created successfully",
            data: news
        });
    } catch (error) {
        next(error);
    }
};

export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, description, fullDescription, slug } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const fullDescriptionImages = normalizePaths(files["newsFullDescriptionImages"] || []);

        const news = await newsRepository.findOne({ where: { id, deletedAt: IsNull() } });
        if (!news) throw new CustomError("News not found", 404);

        if (fullDescriptionImages.length > 0) {
            news.fullDescriptionImages?.forEach(image => deleteFileBeforeSave(image));
            news.fullDescriptionImages = fullDescriptionImages;
        }

        news.title = title ?? news.title;
        news.description = description ?? news.description;
        news.fullDescription = fullDescription ?? news.fullDescription;
        news.slug = slug ?? news.slug;

        await newsRepository.save(news);

        return res.status(200).json({
            status: 200,
            message: "News updated successfully",
            data: news
        });
    } catch (error) {
        next(error);
    }
};

export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const news = await newsRepository.findOne({ where: { id, deletedAt: IsNull() } });
        if (!news) throw new CustomError("News not found", 404);

        await newsRepository.softDelete(id);

        return res.status(200).json({
            status: 200,
            message: "News deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getAllNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const news = await newsRepository.find({ where: { deletedAt: IsNull() } });

        return res.status(200).json({
            status: 200,
            message: "News retrieved successfully",
            data: news
        });
    } catch (error) {
        next(error);
    }
};

export const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const news = await newsRepository.findOne({ where: { id, deletedAt: IsNull() } });
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
