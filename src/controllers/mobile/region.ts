import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Region } from '../../entities/location.entity';
import { ILike, IsNull } from 'typeorm';
const regionRepository = AppDataSource.getRepository(Region);

export const getRegions = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { name } = req.query;
        let where: any = { deletedAt: IsNull() };
        if(name){
            where = { name: ILike(`%${name}%`) };
        }
        const regions = await regionRepository.find({
            where,
            select: {
            id: true,
            name: true,
        }
    });
    return res.status(200).json({ data: regions, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
}

