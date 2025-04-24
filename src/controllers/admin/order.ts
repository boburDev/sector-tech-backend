import { Request, Response, NextFunction } from "express";
import { In } from "typeorm";
import AppDataSource from "../../config/ormconfig";
import { Order } from "../../entities/order.entity";
import { Product } from "../../entities/products.entity";
import { CustomError } from "../../error-handling/error-handling";

const orderRepo = AppDataSource.getRepository(Order);
const productRepo = AppDataSource.getRepository(Product);

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const orders = await orderRepo.find({
            relations: ["products", "agent", "contrAgent", "user"],
            order: { createdAt: "DESC" },
        });
        return res.status(200).json({ message: "Orders fetched successfully", data: orders, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const order = await orderRepo.findOne({
            where: { id },
            relations: ["products", "agent", "contrAgent", "user"],
        });

        if (!order) throw new CustomError("Order not found", 404);
        return res.status(200).json({ message: "Order fetched successfully", data: order, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const order = await orderRepo.findOneBy({ id });
        if (!order) throw new CustomError("Order not found", 404);

        if (updateData.products) {
            const updatedProducts = await productRepo.findBy({ id: In(updateData.products) });
            updateData.products = updatedProducts;
        }

        orderRepo.merge(order, updateData);
        const updated = await orderRepo.save(order);
        return res.status(200).json({ message: "Order updated", data: updated, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const order = await orderRepo.findOneBy({ id });

        if (!order) throw new CustomError("Order not found", 404);

        order.deletedAt = new Date();
        await orderRepo.save(order);
        return res.status(200).json({ message: "Order deleted", data: null, error: null, status: 200 });
    } catch (error) {
        next(error);
    }
};
