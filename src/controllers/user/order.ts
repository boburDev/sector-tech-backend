import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../config/ormconfig";
import { Order } from "../../entities/order.entity";
import { Product } from "../../entities/products.entity";
import { Kontragent } from "../../entities/kontragent.entity";
import { KontragentAddress } from "../../entities/kontragent_addresses.entity";
import { Users } from "../../entities/user.entity";
import { CustomError } from "../../error-handling/error-handling";
import { In } from "typeorm";
import { Garantee } from "../../entities/garantee.entity";
const orderRepo = AppDataSource.getRepository(Order);
const productRepo = AppDataSource.getRepository(Product);
const kontragentRepo = AppDataSource.getRepository(Kontragent);
const kontragentAddressRepo = AppDataSource.getRepository(KontragentAddress);
const userRepo = AppDataSource.getRepository(Users);
const garanteeRepo = AppDataSource.getRepository(Garantee);

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { receiverInfo, productDetails, orderInfo } = req.body;
        const { id: userId } = req.user;
        const { fullname, email, phone } = receiverInfo;
        const { kontragentId, agentId, city, comment, deliveryMethod, paymentMethod, total } = orderInfo;

        // Boshlang‘ich tekshiruv
        if (!userId || !fullname || !phone || !email || !productDetails?.length || !kontragentId || !agentId || !city || !total) {
            throw new CustomError("Majburiy maydonlar to‘liq emas", 400);
        }

        const [agent, kontragent, user] = await Promise.all([
            kontragentAddressRepo.findOneBy({ id: agentId }),
            kontragentRepo.findOneBy({ id: kontragentId }),
            userRepo.findOneBy({ id: userId })
        ]);

        if (!agent) throw new CustomError("Agent (KontragentAddress) topilmadi", 404);
        if (!kontragent) throw new CustomError("Kontragent topilmadi", 404);
        if (!user) throw new CustomError("Foydalanuvchi topilmadi", 404);

        const errors: string[] = [];

        // Har bir product va garantee tekshiriladi
        for (const item of productDetails) {
            const product = await productRepo.findOneBy({ id: item.productId });
            const garantee = await garanteeRepo.findOneBy({ id: item.garanteeId });

            if (!product) errors.push(`Mahsulot topilmadi: ${item.productId}`);
            if (!garantee) errors.push(`Kafolat topilmadi: ${item.garanteeId}`);
        }

        if (errors.length === productDetails.length * 2) {
            throw new CustomError("Hech bir mahsulot yoki kafolat topilmadi:\n" + errors.join("\n"), 404);
        }

        if (errors.length) {
            console.warn("⚠️ Ogohlantirishlar:\n" + errors.join("\n"));
        }

        // Order obyektini yaratish
        const order = orderRepo.create({
            agentId,
            contrAgentId: kontragentId,
            userId,
            city,
            comment,
            deliveryMethod: deliveryMethod || "Не отгружен",
            email,
            fullname,
            phone,
            total,
            paymentMethod: paymentMethod || null,
            orderType: "online", // yoki dynamic berishingiz mumkin
            status: "pending",
            orderPriceStatus: "Не оплачен",
            user,
        });

        await orderRepo.save(order);

        return res.status(201).json({
            message: "Buyurtma muvaffaqiyatli yaratildi",
            data: order,
            warnings: errors.length ? errors : null,
            status: 201
        });

    } catch (error) {
        next(error);
    }
};


// export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     try {
//         const { id: userId } = req.user;
//         const orders = await orderRepo.find({
//             relations: ["products", "agent", "contrAgent", "user"],
//             order: { createdAt: "DESC" },
//             where: { userId }   
//         });
//         return res.status(200).json({ message: "Orders fetched successfully", data: orders, error: null, status: 200 });
//     } catch (error) {
//         next(error);
//     }
// };

// export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     try {
//         const { id } = req.params;
//         const { id: userId } = req.user;
//         const order = await orderRepo.findOne({
//             where: { id, userId },
//             relations: ["products", "agent", "contrAgent", "user"],
//         });

//         if (!order) throw new CustomError("Order not found", 404);
//         return res.status(200).json({ message: "Order fetched successfully", data: order, error: null, status: 200 });
//     } catch (error) {
//         next(error);
//     }
// };

// export const updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     try {
//         const { id } = req.params;
//         const { id: userId } = req.user;
//         const updateData = req.body;

//         const order = await orderRepo.findOneBy({ id, userId });
//         if (!order) throw new CustomError("Order not found", 404);

//         if (updateData.products) {
//             const updatedProducts = await productRepo.findBy({ id: In(updateData.products) });
//             updateData.products = updatedProducts;
//         }

//         orderRepo.merge(order, updateData);
//         const updated = await orderRepo.save(order);
//         return res.status(200).json({ message: "Order updated", data: updated, error: null, status: 200 });
//     } catch (error) {
//         next(error);
//     }
// };

// export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     try {
//         const { id } = req.params;
//         const { id: userId } = req.user;
//         const order = await orderRepo.findOneBy({ id, userId });

//         if (!order) throw new CustomError("Order not found", 404);

//         order.deletedAt = new Date();
//         await orderRepo.save(order);
//         return res.status(200).json({ message: "Order deleted", data: null, error: null, status: 200 });
//     } catch (error) {
//         next(error);
//     }
// };

// const orderData = {
//     receiverInfo: {
//         "fullname": "Oybek sobirov sobirovich",
//         "email": "john.doe@example.com",
//         "phone": "+998991234567",
//     },
//     productDetails: [
//         {
//             productId: 1,
//             count: 2,
//             garanteeId: 4
//         },
//         {
//             productId: 2,
//             count: 1,
//             garanteeId: 4
//         }
//     ],
//     orderInfo: {
//         deliveryMethod: "delivery",
//         kontragentId: "uuid-fdfhd-fdfhd-fdfhd",
//         agentId: "uuid-fdfhd-fdfhd-fdfhd",
//         city: "Tashkent",
//         comment: "Comment",
//         total: 100,
//     }
// }