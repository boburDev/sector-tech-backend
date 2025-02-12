import { Request, Response } from 'express';
import { CatalogFilter } from '../entities/catalog_filter.entity';
import AppDataSource from '../config/ormconfig';

const catalogFilterRepository = AppDataSource.getRepository(CatalogFilter);

export const getCatalogFilterById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const filter = await catalogFilterRepository
            .createQueryBuilder('filter')
            .leftJoinAndSelect('filter.subcatalog', 'subcatalog')
            .leftJoinAndSelect('filter.category', 'category')
            .where('filter.subcatalogId = :id OR filter.categoryId = :id', { id })
            .getOne();

        if (!filter) {
            res.status(404).json({ message: 'Catalog filter not found' })
            return;
        }

        res.json(filter)
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error fetching catalog filter', error })
        return;
    }
};

export const createCatalogFilter = async (req: Request, res: Response) => {
    try {
        let { subcatalogId = null, categoryId = null, data = [] } = req.body;

        // data = [
        //     {
        //         name: "collection",
        //         title: "Популярные подборки",
        //         icon: "collection.png",
        //         withSearch: true,
        //         type: "link",
        //         options: [
        //             {
        //                 name: "cisco-2-urovnya-l2-",
        //                 title: "Cisco 2 уровня (L2)"
        //             }
        //         ]
        //     },
        //     {
        //         name: "brand",
        //         title: "Бренд",
        //         icon: "brand.png",
        //         type: "import-checkbox",
        //         url: "/brands"
        //     },
        //     {
        //         name: "price",
        //         title: "Цена",
        //         icon: "price.png",
        //         type: "radio",
        //     },
        //     {   
        //         name: "accommodation",
        //         title: "Размещение",
        //         icon: "accommodation.png",
        //         type: "checkbox",
        //         options: [
        //             {
        //                 name: "montiruemye-v-stoyku",
        //                 title: "Монтируемые в стойку"
        //             }
        //         ]
        //     }
        // ]
        
        const newFilter = catalogFilterRepository.create({
            subcatalogId,
            categoryId,
            data
        });

        await catalogFilterRepository.save(newFilter);
        res.status(201).json(newFilter)
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error creating catalog filter', error })
        return;
    }
};

export const updateCatalogFilter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { subcatalogId, categoryId, data } = req.body;

        const filter = await catalogFilterRepository.findOneBy({ id });

        if (!filter) {
            res.status(404).json({ message: 'Catalog filter not found' })
            return;
        }

        filter.subcatalogId = subcatalogId;
        filter.categoryId = categoryId;
        filter.data = data;

        await catalogFilterRepository.save(filter);
        res.json(filter)
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error updating catalog filter', error })
        return;
    }
};

export const deleteCatalogFilter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const filter = await catalogFilterRepository.findOneBy({ id });

        if (!filter) {
            res.status(404).json({ message: 'Catalog filter not found' })
            return;
        }

        await catalogFilterRepository.softDelete(id);
        res.json({ message: 'Catalog filter deleted successfully' })
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error deleting catalog filter', error })
        return;
    }
};
