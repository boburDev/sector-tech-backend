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

        if (name !== 'catalog') {
            return res.status(400).json({ message: 'Invalid query parameter: name must be "catalog"' });
        }

        const elements = await catalogRepository.find({ order: { updatedAt: 'ASC' } });

        const elementIndex = elements.findIndex(element => element.id === id);
        if (elementIndex === -1) {
            return res.status(404).json({ message: 'Catalog not found' });
        }

        if (index < 0 || index >= elements.length) {
            return res.status(400).json({ message: 'Invalid index' });
        }

        if (elementIndex === index) {
            return res.status(200).json({ message: 'Catalog already in this index' });
        }

        const [selectedCatalog] = elements.splice(elementIndex, 1);
        elements.splice(index, 0, selectedCatalog);

        const updatedCatalogs = elements.map((catalog) => ({
            ...catalog,
            updatedAt: new Date(),
        }));

        await catalogRepository.save(updatedCatalogs);

        return res.status(200).json({ message: 'Catalog updated successfully' });

    } catch (error) {
        console.error('Error updating catalog order:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
