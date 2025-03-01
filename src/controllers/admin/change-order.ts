import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { PopularBrand, PopularCategory, PopularProduct } from '../../entities/popular.entity';
import { Catalog, Subcatalog, Category } from '../../entities/catalog.entity';
import { Brand } from '../../entities/brands.entity';

const catalogRepository = AppDataSource.getRepository(Catalog); 
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);
const brandRepository = AppDataSource.getRepository(Brand);
const popularBrandRepository = AppDataSource.getRepository(PopularBrand);
const popularCategoryRepository = AppDataSource.getRepository(PopularCategory);
const popularProductRepository = AppDataSource.getRepository(PopularProduct);


export const changeOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name } = req.query;
        const { index, id } = req.body;

        console.log(req.body);
        console.log(req.query);

        if (name === 'catalog') {
            const elements = await catalogRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) {
                return res.status(404).json({ message: 'Catalog topilmadi' });
            }

            const [selectedCatalog] = elements.splice(elementIndex, 1);
            elements.splice(index - 1, 0, selectedCatalog);

            const updatedCatalogs = elements.map((catalog) => ({
                ...catalog,
                updatedAt: new Date(),
            }));

            await catalogRepository.save(updatedCatalogs);
            return res.status(200).json({ message: 'Catalog muvaffaqiyatli yangilandi' });
        }

        return res.status(400).json({ message: 'Noto‘g‘ri so‘rov parametrlari yoki catalog topilmadi' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ichki server xatosi', error });
    }
};
