import { Request, Response } from "express";
import { Garantee } from "../../entities/garantee.entity";
import AppDataSource from "../../config/ormconfig";
import { Product } from "../../entities/products.entity";
import { IsNull } from "typeorm";
const garanteeRepository = AppDataSource.getRepository(Garantee);
const productRepository = AppDataSource.getRepository(Product);

export const createGarantee = async (req: Request, res: Response): Promise<any> => {
    const { title, price, productId } = req.body;
    if (!title || !price || !productId) {
        return res.status(400).json({ message: "Title, price and productId are required" });
    }

    const product = await productRepository.findOne({ where: { id: productId, deletedAt: IsNull() } });
    if (!product) {
        return res.status(400).json({ message: "Product not found" });
    }

    const regex = /^(?:\d+(?:\.\d{1,2})?|[^\d]+)$/;
    if (!regex.test(price)) {
        return res.status(400).json({ message: "Price must be either a number or a string without digits" });
    }

    const existingGarantee = await garanteeRepository.findOne({ where: { title, productId, deletedAt: IsNull() } });
    if (existingGarantee) {
        return res.status(400).json({ message: "Garantee with this title already exists for the given product" });
    }


    const garantee = new Garantee();
    garantee.title = title;
    garantee.price = price;
    garantee.productId = productId;
    await garanteeRepository.save(garantee);
    res.status(201).json({ data: garantee, error: null, status: 201 });
};

export const getGarantees = async (req: Request, res: Response): Promise<any> => {
    const garantees = await garanteeRepository.find({
        where: { deletedAt: IsNull() },
        select: {
            id: true,
            title: true,
            price: true,
        }
    });
    res.status(200).json({ data: garantees, error: null, status: 200 });
}

export const updateGarantee = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, price, productId } = req.body;
    const regex = /^(?:\d+(?:\.\d{1,2})?|[^\d]+)$/;
    if(!id){
        return res.status(400).json({ message: "Id is required" });
    }
    if(price){
        if (!regex.test(price)) {
            return res.status(400).json({ message: "Price must be either a number or a string without digits" });
        }
    }
    const garantee = await garanteeRepository.findOne({ where: { id: id as string, deletedAt: IsNull() } });
    if(!garantee) {
        return res.status(400).json({ message: "Garantee not found" });
    }
    garantee.title = title || garantee.title;
    garantee.price = price || garantee.price;
    garantee.productId = productId || garantee.productId;
    await garanteeRepository.save(garantee);
    res.status(200).json({ data: garantee, error: null, status: 200 });
}

export const deleteGarantee = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    if(!id){
        return res.status(400).json({ message: "Id is required" });
    }

    const garantee = await garanteeRepository.findOne({ where: { id, deletedAt: IsNull() } });
    if(!garantee) {
        return res.status(400).json({ message: "Garantee not found" });
    }   
    garantee.deletedAt = new Date();    
    await garanteeRepository.save(garantee);
    res.status(200).json({ message: "Garantee deleted successfully", error: null, status: 200 });
}

