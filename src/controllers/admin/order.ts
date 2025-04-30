import { Request, Response, NextFunction } from "express";
import { IsNull, Not, In } from "typeorm";
import AppDataSource from "../../config/ormconfig";
import { Order } from "../../entities/order.entity";
import { CustomError } from "../../error-handling/error-handling";
import { Kontragent } from "../../entities/kontragent.entity";
import { KontragentAddress } from "../../entities/kontragent_addresses.entity";
import { Product } from "../../entities/products.entity";
const orderRepo = AppDataSource.getRepository(Order);
const kontragentRepo = AppDataSource.getRepository(Kontragent);
const kontragentAddressRepo = AppDataSource.getRepository(KontragentAddress);
const productRepo = AppDataSource.getRepository(Product);

export const updateOrderForAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id: orderId } = req.params;
        const { id: adminId } = req.admin;
        const updateData = req.body;

        const order = await orderRepo.findOne({
            where: { id: orderId, deletedAt: IsNull() }
        });

        if (!order) {
            throw new CustomError("Order not found", 404);
        }

        const allowedFields = [
            'orderType',
            'paymentMethod',
            'orderPriceStatus',
            'deliveryMethod',
            'orderDeliveryType',
            'comment',
            'validStartDate',
            'validEndDate',
            'deletedAt'
        ];

        for (const key of allowedFields) {
            if (key in updateData) {
                (order as any)[key] = updateData[key];
            }
        }

        order.adminId = adminId;
        const updatedOrder = await orderRepo.save(order);

        return res.status(200).json({
            message: "Order successfully updated by admin",
            data: updatedOrder,
            error: null,
            status: 200
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const orders = await orderRepo.find({
            relations: ["user"],
            where: { deletedAt: IsNull() },
            order: { createdAt: "DESC" },
            select: {
                id: true,
                orderNumber: true,
                fullname: true,
                phone: true,
                email: true,
                city: true,
                comment: true,
                deliveryMethod: true,
                paymentMethod: true,
                total: true,
                orderPriceStatus: true,
                orderType: true,
                validStartDate: true,
                validEndDate: true,
                contrAgentId: true,
                agentId: true,
                products: true,
                createdAt: true,
                user: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                }
            }
        });

        if (orders.length === 0) {
            return res.status(200).json({
                message: "No orders found",
                data: [],
                error: null,
                status: 200
            });
        }

        const kontragentIds = orders.map(order => order.contrAgentId).filter(id => !!id);
        const agentIds = orders.map(order => order.agentId).filter(id => !!id);

        const [kontragents, kontragentAddresses, products] = await Promise.all([
            kontragentRepo.find({
                where: { id: In(kontragentIds) },
                select: {
                    id: true,
                    name: true,
                    address: true,
                    inn: true,
                    pinfl: true,
                    countryOfRegistration: true,
                    oked: true,
                    legalAddress: true,
                    ownershipForm: true,
                }
            }),
            kontragentAddressRepo.find({
                where: { id: In(agentIds) },
                select: {
                    id: true,
                    apartment: true,
                    country: true,
                    district: true,
                    house: true,
                    street: true,
                    comment: true,
                    fullAddress: true,
                    index: true,
                    region: true,
                }
            }),
            productRepo.find({
                where: { id: In(orders.flatMap(order => order.products.map(product => product.productId))) },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    price: true,
                    productCode: true,
                    mainImage: true,
                }
            })
        ]);

        const kontragentMap = new Map(kontragents.map(k => [k.id, k]));
        const kontragentAddressMap = new Map(kontragentAddresses.map(k => [k.id, k]));
        const productMap = new Map(products.map(p => [p.id, p]));

        const updatedOrders = orders.map(order => {
            const kontragent = kontragentMap.get(order.contrAgentId) || null;
            const agent = order.agentId ? kontragentAddressMap.get(order.agentId) || null : null;

            const updatedProducts = order.products.map(product => {
                const productInfo = productMap.get(product.productId);
                return {
                    ...product,
                    product: productInfo || null,
                    productLink: productInfo ? `/product/${productInfo.slug}` : null
                };
            });

            return {
                ...order,
                kontragent,
                agent,
                products: updatedProducts
            };
        });

        return res.status(200).json({
            message: "Orders fetched successfully",
            data: updatedOrders,
            error: null,
            status: 200
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};
