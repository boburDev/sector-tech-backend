import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../config/ormconfig";
import { Order } from "../../entities/order.entity";
import { Product } from "../../entities/products.entity";
import { Kontragent } from "../../entities/kontragent.entity";
import { KontragentAddress } from "../../entities/kontragent_addresses.entity";
import { Users } from "../../entities/user.entity";
import { CustomError } from "../../error-handling/error-handling";
import { Garantee } from "../../entities/garantee.entity";
import { Between, ILike, In, IsNull, Not } from "typeorm";
import { generateOrderNumber } from "../../utils/generate-order-number";
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

    if (!userId || !fullname || !phone || !email || !productDetails?.length || !kontragentId || !city) {
      throw new CustomError("Majburiy maydonlar to‘liq emas", 400);
    }

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

    const orderNumber = generateOrderNumber();

    const now = new Date();
    const validStartDate = now;
    const validEndDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);


    const newOrder = orderRepo.create({
      orderNumber,
      agentId: agentId || null,
      contrAgentId: kontragentId,
      userId,
      kontragentName: kontragent.name,
      city,
      comment: comment || null,
      deliveryMethod,
      email,
      fullname,
      phone,
      total: totalPrice,
      paymentMethod: paymentMethod || null,
      orderType: "new",
      orderPriceStatus: "Не оплачен",
      products: productItems,
      validStartDate,
      validEndDate
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
    const { last, kontragentName, orderPriceStatus, orderDeleveryType, orderType, periodStart, periodEnd, orderNumber, price, name, limit, page } = req.query;

    if (last === "true") {
      const lastOrder = await orderRepo.findOne({
        where: { userId, deletedAt: IsNull() },
        relations: ["user"],
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

      if (!lastOrder) {
        return res.status(200).json({
          message: "No order found",
          data: [],
          error: null,
          status: 200
        });
      }

      const kontragent = lastOrder.contrAgentId
        ? await kontragentRepo.findOne({
          where: { id: lastOrder.contrAgentId },
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
        })
        : null;

      const agent = lastOrder.agentId
        ? await kontragentAddressRepo.findOne({
          where: { id: lastOrder.agentId },
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
        })
        : null;

      const productIds = lastOrder.products.map(p => p.productId);

      const products = await productRepo.find({
        where: { id: In(productIds) },
        select: {
          id: true,
          slug: true,
          title: true,
          price: true,
          productCode: true,
          mainImage: true,
        }
      });

      const productMap = new Map(products.map(p => [p.id, p]));

      const updatedProducts = lastOrder.products.map(product => {
        const productInfo = productMap.get(product.productId);
        return {
          ...product,
          product: productInfo || null,
          productLink: productInfo ? `/product/${productInfo.slug}` : null
        };
      });

      const updatedOrder = {
        ...lastOrder,
        kontragent,
        agent,
        products: updatedProducts
      };

      return res.status(200).json({
        message: "Order fetched successfully",
        data: [updatedOrder],
        error: null,
        status: 200
      });
    }

    const where: any = { userId, deletedAt: IsNull() };
    let orderBy: any = { };

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const offset = (pageNumber - 1) * limitNumber;


    if (orderPriceStatus) {
      where.orderPriceStatus = orderPriceStatus;
    }

    if (orderDeleveryType) {
      where.orderDeleveryType = orderDeleveryType;
    }

    if (orderType) {
      where.orderType = orderType;
    }

    if (orderNumber) {
      where.orderNumber = ILike(`%${orderNumber}%`);
    }

    if (periodStart && periodEnd) {
      where.createdAt = Between(new Date(periodStart as string), new Date(periodEnd as string));
    }

    if (kontragentName) {
      where.kontragentName = ILike(`%${kontragentName}%`);
    }

    if (price === "asc") {
      orderBy.total = "ASC";
    } else if (price === "desc") {
      orderBy.total = "DESC";
    }

    if (name === "asc") {
      orderBy.kontragentName = "ASC";
    } else if (name === "desc") {
      orderBy.kontragentName = "DESC";
    } 

    if (Object.keys(orderBy).length === 0) {
      orderBy.createdAt = "DESC";
    }

    const orders = await orderRepo.find({
      relations: ["user"],
      where,
      order: orderBy,
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
        kontragentName: true,
        agentId: true,
        products: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          phone: true,
          email: true,
        }
      },
      skip: offset,
      take: limitNumber
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
      data: { orders: updatedOrders, total: updatedOrders.length, page: pageNumber, limit: limitNumber },
      error: null,
      status: 200
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const order = await orderRepo.findOne({
      where: { id, userId, deletedAt: IsNull() },
      relations: ["user"],
      select: {
        id: true,
        orderNumber: true,
        fullname: true,
        phone: true,
        email: true,
        kontragentName: true,
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

    if (!order) throw new CustomError("Order not found", 404);

    const kontragentId = order.contrAgentId;
    const agentId = order.agentId;

    const kontragent = kontragentId
      ? await kontragentRepo.findOne({
        where: { id: kontragentId },
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
      })
      : null;

    const agent = agentId
      ? await kontragentAddressRepo.findOne({
        where: { id: agentId },
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
      })
      : null;

    const allProductIds = order.products.map(product => product.productId);

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

    const productMap = new Map(products.map(p => [p.id, p]));

    const updatedProducts = order.products.map(product => {
      const productInfo = productMap.get(product.productId);
      return {
        ...product,
        product: productInfo || null,
        productLink: productInfo ? `/product/${productInfo.slug}` : null
      };
    });

    const updatedOrder = {
      ...order,
      kontragent,
      agent,
      products: updatedProducts
    };

    return res.status(200).json({
      message: "Order fetched successfully",
      data: updatedOrder,
      error: null,
      status: 200
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { orderType } = req.body;

    const order = await orderRepo.findOne({
      where: { id, userId, deletedAt: IsNull() }
    });

    if (!order) {
      throw new CustomError("Buyurtma topilmadi", 404);
    }

    if (orderType) order.orderType = orderType;

    const updatedOrder = await orderRepo.save(order);

    return res.status(200).json({
      message: "Buyurtma statusi o'zgartirildi",
      data: updatedOrder,
      error: null,
      status: 200
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};