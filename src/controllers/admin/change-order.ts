import { NextFunction, Request, Response } from 'express';
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



export const changeOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { name } = req.query;
        const { index, id } = req.body;

        if (name === 'catalog') {
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

            const [movedElement] = elements.splice(elementIndex, 1);

            if (elementIndex > index) {
                elements.splice(index, 0, movedElement);
            } else {
                elements.splice(index, 0, movedElement);
            }

            for (const i of elements) {
                i.updatedAt = new Date();
                await catalogRepository.save(i);
            }
            return res.status(200).json({ message: 'Catalog updated successfully' });
        }

        if (name === 'subcatalog') {
            const elements = await subcatalogRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) {
                return res.status(404).json({ message: 'Subcatalog not found' });
            }

            if (index < 0 || index >= elements.length) {
                return res.status(400).json({ message: 'Invalid index' });
            }

            if (elementIndex === index) {
                return res.status(200).json({ message: 'Subcatalog already in this index' });
            }

            const [movedElement] = elements.splice(elementIndex, 1);

            if (elementIndex > index) {
                elements.splice(index, 0, movedElement);
            } else {
                elements.splice(index, 0, movedElement);
            }

            for (const i of elements) {
                i.updatedAt = new Date();
                await subcatalogRepository.save(i);
            }
            return res.status(200).json({ message: 'Subcatalog updated successfully' });
        }

        if (name === 'category') {
            const elements = await categoryRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) {
                return res.status(404).json({ message: 'Category not found' });
            }

            if (index < 0 || index >= elements.length) {
                return res.status(400).json({ message: 'Invalid index' });
            }

            if (elementIndex === index) {
                return res.status(200).json({ message: 'Category already in this index' });
            }

            const [movedElement] = elements.splice(elementIndex, 1);

            if (elementIndex > index) {
                elements.splice(index, 0, movedElement);
            } else {
                elements.splice(index, 0, movedElement);
            }   

            for (const i of elements) {
                i.updatedAt = new Date();
                await categoryRepository.save(i);
            }
            return res.status(200).json({ message: 'Category updated successfully' });  
        }       

        if (name === 'brand') {
            const elements = await brandRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) {
                return res.status(404).json({ message: 'Brand not found' });
            }

            if (index < 0 || index >= elements.length) {
                return res.status(400).json({ message: 'Invalid index' });
            }

            if (elementIndex === index) {
                return res.status(200).json({ message: 'Brand already in this index' });
            }       

            const [movedElement] = elements.splice(elementIndex, 1);

            if (elementIndex > index) {
                elements.splice(index, 0, movedElement);
            } else {
                elements.splice(index, 0, movedElement);
                }

            for (const i of elements) {
                i.updatedAt = new Date();
                await brandRepository.save(i);
            }
            return res.status(200).json({ message: 'Brand updated successfully' });
        }

        if (name === 'popularBrand') {
            const elements = await popularBrandRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) {
                return res.status(404).json({ message: 'Popular brand not found' });
            }

            if (index < 0 || index >= elements.length) {
                return res.status(400).json({ message: 'Invalid index' });
            }
            return res.status(400).json({ message: 'Invalid query parameter: name must be "catalog"' });
        }   

        if (name === 'popularCategory') {
            const elements = await popularCategoryRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) {
                return res.status(404).json({ message: 'Popular category not found' });
            }

            if (index < 0 || index >= elements.length) {
                return res.status(400).json({ message: 'Invalid index' });
            }

            if (elementIndex === index) {
                return res.status(200).json({ message: 'Popular category already in this index' });
            }

            const [movedElement] = elements.splice(elementIndex, 1);

            if (elementIndex > index) {
                elements.splice(index, 0, movedElement);
            } else {
                elements.splice(index, 0, movedElement);
            }

            for (const i of elements) {
                i.updatedAt = new Date();
                await popularCategoryRepository.save(i);
            }   

            return res.status(200).json({ message: 'Popular category updated successfully' });
        }   

        if (name === 'popularProduct') {
            const elements = await popularProductRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) {
                return res.status(404).json({ message: 'Popular product not found' });
            }

            if (index < 0 || index >= elements.length) {
                return res.status(400).json({ message: 'Invalid index' });
            }

            if (elementIndex === index) {
                return res.status(200).json({ message: 'Popular product already in this index' });
            }

            const [movedElement] = elements.splice(elementIndex, 1);

            if (elementIndex > index) {
                elements.splice(index, 0, movedElement);
            } else {
                elements.splice(index, 0, movedElement);
            }

            for (const i of elements) { 
                i.updatedAt = new Date();
                await popularProductRepository.save(i);
            }
            return res.status(200).json({ message: 'Popular product updated successfully' });
        }    

        return res.status(400).json({ message: 'Invalid query parameter: name must be "catalog"' });
    } catch (error) {
        next(error);
    }
};

