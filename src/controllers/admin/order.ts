import { Request, Response, NextFunction } from "express";
import { IsNull } from "typeorm";
import AppDataSource from "../../config/ormconfig";
import { Order } from "../../entities/order.entity";
import { CustomError } from "../../error-handling/error-handling";
const orderRepo = AppDataSource.getRepository(Order);

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
