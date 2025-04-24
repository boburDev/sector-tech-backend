import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../config/ormconfig";
import { Order } from "../../entities/order.entity";
import { Product } from "../../entities/products.entity";
import { Kontragent } from "../../entities/kontragent.entity";
import { KontragentAddress } from "../../entities/kontragent_addresses.entity";
import { Users } from "../../entities/user.entity";

const orderRepo = AppDataSource.getRepository(Order);
const productRepo = AppDataSource.getRepository(Product);
const kontragentRepo = AppDataSource.getRepository(Kontragent);
const kontragentAddressRepo = AppDataSource.getRepository(KontragentAddress);
const userRepo = AppDataSource.getRepository(Users);

// export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     try {
//         const { agentId, contrAgentId, city, comment, deliveryMethod, email, firstname, lastname, fullname, phone, total, products } = req.body;
//         const { id: userId } = req.user;
//         if (!agentId || !contrAgentId || !userId || !products?.length) {
//             throw new CustomError("Missing required fields", 400);
//         }

//         const [agent, kontragent, user, productEntities] = await Promise.all([
//             kontragentAddressRepo.findOneBy({ id: agentId }),
//             kontragentRepo.findOneBy({ id: contrAgentId }),
//             userRepo.findOneBy({ id: userId }),
//             productRepo.findBy({ id: In(products) })
//         ]);

//         if (!agent || !kontragent || !user || productEntities.length === 0) {
//             throw new CustomError("Invalid agent, kontragent, user or products", 404);
//         }

//         const order = orderRepo.create({
//             agentId,
//             contrAgentId,
//             userId,
//             city,
//             comment,
//             deliveryMethod,
//             email,
//             firstname,
//             lastname,
//             fullname,
//             phone,
//             total,
//             products: productEntities,
//             agent,
//             contrAgent: kontragent,
//             user,
//             status: OrderStatus.PENDING
//         });

//         await orderRepo.save(order);
//         return res.status(201).json({ message: "Order created successfully", data: order, error: null, status: 201 });
//     } catch (error) {
//         next(error);
//     }
// };

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