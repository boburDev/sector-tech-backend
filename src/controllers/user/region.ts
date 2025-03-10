import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { Region } from '../../entities/location.entity';
import { IsNull } from 'typeorm';
const regionRepository = AppDataSource.getRepository(Region);

export const getRegions = async (req: Request, res: Response): Promise<any> => {
    const regions = await regionRepository.find({
        where: { deletedAt: IsNull() },
        select: {
            id: true,
            name: true,
        }
    });
    return res.status(200).json({ data: regions, error: null, status: 200 });
}

