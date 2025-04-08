import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { PopularBrand, PopularCategory, PopularProduct } from '../../entities/popular.entity';
import { Catalog, Subcatalog, Category } from '../../entities/catalog.entity';
import { Brand } from '../../entities/brands.entity';
import { CustomError } from '../../error-handling/error-handling';

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
            if (elementIndex === -1) throw new CustomError('Catalog not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Catalog already in this index', 400);

            const [movedElement] = elements.splice(elementIndex, 1);

            elements.splice(index, 0, movedElement);

            for (let i = 0; i < elements.length; i++) {
                elements[i].updatedAt = new Date(Date.now() + i);
            }
            await catalogRepository.save(elements);  
            return res.status(200).json({ message: 'Catalog order changed successfully' });
        }

        if (name === 'subcatalog') {
            const subcatalog = await subcatalogRepository.findOne({ where: { id: id } });

            const elements = await subcatalogRepository.find({ where: { catalogId: subcatalog?.catalogId }, order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) throw new CustomError('Subcatalog not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Subcatalog already in this index', 400);

            const [movedElement] = elements.splice(elementIndex, 1);
            elements.splice(index, 0, movedElement);

            for (let i = 0; i < elements.length; i++) {
                elements[i].updatedAt = new Date(Date.now() + i);
            }
            await subcatalogRepository.save(elements);
            return res.status(200).json({ message: 'Subcatalog order changed successfully' });
        }

        if (name === 'category') {
            const category = await categoryRepository.findOne({ where: { id: id } });
            const elements = await categoryRepository.find({ where: { subCatalogId: category?.subCatalogId }, order: { updatedAt: 'ASC' } });
            
            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) throw new CustomError('Category not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);
            if (elementIndex === index) throw new CustomError('Category already in this index', 400);

            const [movedElement] = elements.splice(elementIndex, 1);
            elements.splice(index, 0, movedElement);

            for (let i = 0; i < elements.length; i++) {
                elements[i].updatedAt = new Date(Date.now() + i);
            }
            await categoryRepository.save(elements);

            return res.status(200).json({ message: 'Category order changed successfully' });
        }
   

        if (name === 'brand') {
            const elements = await brandRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) throw new CustomError('Brand not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Brand already in this index', 400);

            const [movedElement] = elements.splice(elementIndex, 1);
            elements.splice(index, 0, movedElement);

            for (let i = 0; i < elements.length; i++) {
                elements[i].updatedAt = new Date(Date.now() + i);
            }
            await brandRepository.save(elements);
            return res.status(200).json({ message: 'Brand order changed successfully' });
        }

        if (name === 'popularBrand') {
            const elements = await popularBrandRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) throw new CustomError('Popular brand not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Popular brand already in this index', 400);

            const [movedElement] = elements.splice(elementIndex, 1);

            elements.splice(index, 0, movedElement);

            for (let i = 0; i < elements.length; i++) {
                elements[i].updatedAt = new Date(Date.now() + i);
            }
            await popularBrandRepository.save(elements);
            return res.status(200).json({ message: 'Popular brand order changed successfully' });
        }
        if (name === 'popularCategory') {
            const elements = await popularCategoryRepository.find({ order: { updatedAt: 'ASC' } });
            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) throw new CustomError('Popular category not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Popular category already in this index', 400);

            const [movedElement] = elements.splice(elementIndex, 1);

            elements.splice(index, 0, movedElement);

            for (let i = 0; i < elements.length; i++) {
                elements[i].updatedAt = new Date(Date.now() + i);
            }
            await popularCategoryRepository.save(elements);

            return res.status(200).json({ message: 'Popular category order changed successfully' });
        }   

        if (name === 'popularProduct') {
            const elements = await popularProductRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) throw new CustomError('Popular product not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Popular product already in this index', 400);

            const [movedElement] = elements.splice(elementIndex, 1);
            elements.splice(index, 0, movedElement);

            for (let i = 0; i < elements.length; i++) {
                elements[i].updatedAt = new Date(Date.now() + i);
            }   

            await popularProductRepository.save(elements);
            return res.status(200).json({ message: 'Popular product order changed successfully' });
        }    

        throw new CustomError('Invalid query parameter: name must be "catalog"', 400)
    } catch (error) {
        next(error);
    }
};
