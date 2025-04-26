import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../config/ormconfig";
import { Order } from "../../entities/order.entity";
import { Product } from "../../entities/products.entity";
import { Kontragent } from "../../entities/kontragent.entity";
import { KontragentAddress } from "../../entities/kontragent_addresses.entity";
import { Users } from "../../entities/user.entity";
import { CustomError } from "../../error-handling/error-handling";
import { Garantee } from "../../entities/garantee.entity";
import { In } from "typeorm";
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
    const { kontragentId, agentId, city, comment, deliveryMethod, paymentMethod } = orderInfo;

    // Majburiy maydonlarni tekshirish
    if (!userId || !fullname || !phone || !email || !productDetails?.length || !kontragentId || !city) {
      throw new CustomError("Majburiy maydonlar to‘liq emas", 400);
    }

    // Bazaviy obyektlarni olish
    const [kontragent, user, agent] = await Promise.all([
      kontragentRepo.findOneBy({ id: kontragentId }),
      userRepo.findOneBy({ id: userId }),
      agentId ? kontragentAddressRepo.findOneBy({ id: agentId }) : Promise.resolve(null)
    ]);

    if (!kontragent) throw new CustomError("Kontragent topilmadi", 404);
    if (!user) throw new CustomError("Foydalanuvchi topilmadi", 404);
    if (agentId && !agent) throw new CustomError("Agent (KontragentAddress) topilmadi", 404);
    
    let totalPrice = 0;
    const errors: string[] = [];
    const productItems: any[] = [];

    // Mahsulotlar va kafolatlarni tekshirish
    for (const item of productDetails) {
      const product = await productRepo.findOneBy({ id: item.productId });

      if (!product) {
        errors.push(`Mahsulot topilmadi: ${item.productId}`);
        continue;
      }

      const count = item.count || 1;
      let garantee;
      let garanteePrice = 0;

      if (item.garanteeId) {
        garantee = await garanteeRepo.findOneBy({ id: item.garanteeId });
        if (!garantee) {
          errors.push(`Kafolat topilmadi: ${item.garanteeId}`);
        } else {
          garanteePrice = Number(garantee.price || 0) * count;
        }
      }

      const productTotal = product.price * count + garanteePrice;
      totalPrice += productTotal;

      productItems.push({
        productId: product.id,
        count,
        price: product.price,
        ...(garantee && {
          garantee: {
            id: garantee.id,
            title: garantee.title,
            price: garantee.price
          }
        })
      });
    }

    if (errors.length === productDetails.length * 2) {
      throw new CustomError("Hech bir mahsulot yoki kafolat topilmadi:\n" + errors.join("\n"), 404);
    }

    if (errors.length) {
      console.warn("⚠️ Ogohlantirishlar:\n" + errors.join("\n"));
    }

    const newOrder = orderRepo.create({
      agentId: agentId || null,
      contrAgentId: kontragentId,
      userId,
      city,
      comment: comment || null,
      deliveryMethod,
      email,
      fullname,
      phone,
      total: totalPrice,
      paymentMethod: paymentMethod || null,
      orderType: "online",
      orderPriceStatus: "Не оплачен",
      products: productItems
    });

    const savedOrder = await orderRepo.save(newOrder);

    return res.status(201).json({
      message: "Buyurtma muvaffaqiyatli yaratildi",
      data: savedOrder,
      warnings: errors.length ? errors : null,
      status: 201
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id: userId } = req.user;

    const orders = await orderRepo.find({
      relations: ["user"],
      order: { createdAt: "DESC" },
      where: { userId },
      select: {
        id: true,
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
        user: {
          id: true,
          name: true,
          phone: true,
          email: true,
        }
      }
    });

    const kontragentIds = orders.map(order => order.contrAgentId).filter(id => !!id);
    const agentIds = orders.map(order => order.agentId).filter(id => !!id);

    const kontragents = await kontragentRepo.find({
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
    });

    const kontragentAddresses = await kontragentAddressRepo.find({
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
    });

    const allProductIds = orders.flatMap(order => order.products.map(product => product.productId));

    const products = await productRepo.find({
      where: { id: In(allProductIds) },
      select: {
        id: true,
        slug: true,
        title: true,
        price: true,
        productCode: true,
        mainImage: true,
      }
    });

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
    next(error);
  }
};



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