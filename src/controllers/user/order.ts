import { Request, Response, NextFunction } from "express";
import { In } from "typeorm";
import AppDataSource from "../../config/ormconfig";
import { Order } from "../../entities/order.entity";
import { Product } from "../../entities/products.entity";
import { Kontragent } from "../../entities/kontragent.entity";
import { KontragentAddress } from "../../entities/kontragent_addresses.entity";
import { Users } from "../../entities/user.entity";
import { OrderStatus } from "../../common/enums/order-status.enum";
import { CustomError } from "../../error-handling/error-handling";

const orderRepo = AppDataSource.getRepository(Order);
const productRepo = AppDataSource.getRepository(Product);
const kontragentRepo = AppDataSource.getRepository(Kontragent);
const kontragentAddressRepo = AppDataSource.getRepository(KontragentAddress);
const userRepo = AppDataSource.getRepository(Users);

//
// CREATE
//
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            agentId,
            contrAgentId,
            userId,
            city,
            comment,
            deliveryMethod,
            email,
            firstname,
            lastname,
            fullname,
            phone,
            total,
            products
        } = req.body;

        if (!agentId || !contrAgentId || !userId || !products?.length) {
            throw new CustomError("Missing required fields", 400);
        }

        const [agent, kontragent, user, productEntities] = await Promise.all([
            kontragentAddressRepo.findOneBy({ id: agentId }),
            kontragentRepo.findOneBy({ id: contrAgentId }),
            userRepo.findOneBy({ id: userId }),
            productRepo.findBy({ id: In(products) })
        ]);

        if (!agent || !kontragent || !user || productEntities.length === 0) {
            throw new CustomError("Invalid agent, kontragent, user or products", 404);
        }

        const order = orderRepo.create({
            agentId,
            contrAgentId,
            userId,
            city,
            comment,
            deliveryMethod,
            email,
            firstname,
            lastname,
            fullname,
            phone,
            total,
            products: productEntities,
            agent,
            contrAgent: kontragent,
            user,
            status: OrderStatus.PENDING
        });

        await orderRepo.save(order);
        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        next(error);
    }
};

//
// GET ALL
//
export const getAllOrders = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderRepo.find({
            relations: ["products", "agent", "contrAgent", "user"],
            order: { createdAt: "DESC" }
        });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

//
// GET BY ID
//
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const order = await orderRepo.findOne({
            where: { id },
            relations: ["products", "agent", "contrAgent", "user"]
        });

        if (!order) throw new CustomError("Order not found", 404);
        res.json(order);
    } catch (error) {
        next(error);
    }
};

//
// UPDATE
//
export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
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
        res.json({ message: "Order updated", order: updated });
    } catch (error) {
        next(error);
    }
};

//
// DELETE
//
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const order = await orderRepo.findOneBy({ id });

        if (!order) throw new CustomError("Order not found", 404);

        await orderRepo.softDelete(id);
        res.json({ message: "Order deleted" });
    } catch (error) {
        next(error);
    }
};
