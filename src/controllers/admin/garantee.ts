import { NextFunction, Request, Response } from "express";
import { Garantee } from "../../entities/garantee.entity";
import AppDataSource from "../../config/ormconfig";
import { IsNull } from "typeorm";
import { CustomError } from "../../error-handling/error-handling";
const garanteeRepository = AppDataSource.getRepository(Garantee);

export const createGarantee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { title, price } = req.body;
        if (!title || !price) throw new CustomError('Title and price are required', 400);
    const regex = /^(?:\d+(?:\.\d{1,2})?|[^\d]+)$/;
    if (!regex.test(price)) throw new CustomError('Price must be either a number or a string without digits', 400);

    const existingGarantee = await garanteeRepository.findOne({ where: { title, deletedAt: IsNull() } });
    if (existingGarantee) throw new CustomError('Garantee with this title already exists', 400);


    const garantee = new Garantee();
        garantee.title = title;
        garantee.price = price;
        await garanteeRepository.save(garantee);
        res.status(201).json({ data: garantee, error: null, status: 201 });
    } catch (error) {
        next(error);
    }
};

export const getGarantees = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const garantees = await garanteeRepository.find({
            where: { deletedAt: IsNull() },
            select: {
                id: true,
                title: true,
                price: true,
            }
        });
        res.status(200).json({ data: garantees, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const updateGarantee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const { title, price } = req.body;
        const regex = /^(?:\d+(?:\.\d{1,2})?|[^\d]+)$/;
        if(!id) throw new CustomError('Id is required', 400);
        if(price){
            if (!regex.test(price)) throw new CustomError('Price must be either a number or a string without digits', 400);
        }
    const garantee = await garanteeRepository.findOne({ where: { id: id as string, deletedAt: IsNull() } });
    if(!garantee) throw new CustomError('Garantee not found', 404);
        garantee.title = title || garantee.title;
        garantee.price = price || garantee.price;
        await garanteeRepository.save(garantee);
        res.status(200).json({ data: garantee, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const deleteGarantee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        if(!id) throw new CustomError('Id is required', 400);

    const garantee = await garanteeRepository.findOne({ where: { id, deletedAt: IsNull() } });

    if(!garantee) throw new CustomError('Garantee not found', 400);   
    garantee.deletedAt = new Date();    

    await garanteeRepository.save(garantee);
    return res.status(200).json({ message: "Garantee deleted successfully", error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

