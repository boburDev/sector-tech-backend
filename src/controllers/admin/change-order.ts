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

            if (elementIndex === index) throw new CustomError('Catalog already in this index', 200);

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
            if (elementIndex === -1) throw new CustomError('Subcatalog not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Subcatalog already in this index', 200);

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
            if (elementIndex === -1) throw new CustomError('Category not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Category already in this index', 200);

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
            if (elementIndex === -1) throw new CustomError('Brand not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Brand already in this index', 200);

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
            if (elementIndex === -1) throw new CustomError('Popular brand not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Popular brand already in this index', 200);

            const [movedElement] = elements.splice(elementIndex, 1);

            if (elementIndex > index) {
                elements.splice(index, 0, movedElement);
            } else {
                elements.splice(index, 0, movedElement);
            }

            for (const i of elements) {
                i.updatedAt = new Date();
                await popularBrandRepository.save(i);
            }
            return res.status(200).json({ message: 'Popular brand updated successfully' });
        }
        if (name === 'popularCategory') {
            const elements = await popularCategoryRepository.find({ order: { updatedAt: 'ASC' } });

            const elementIndex = elements.findIndex(element => element.id === id);
            if (elementIndex === -1) throw new CustomError('Popular category not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Popular category already in this index', 200);

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
            if (elementIndex === -1) throw new CustomError('Popular product not found', 404);

            if (index < 0 || index >= elements.length) throw new CustomError('Invalid index', 400);

            if (elementIndex === index) throw new CustomError('Popular product already in this index', 200);

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

        throw new CustomError('Invalid query parameter: name must be "catalog"', 400)
    } catch (error) {
        next(error);
    }
};

