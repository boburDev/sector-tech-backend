import { Request, Response, NextFunction } from 'express';
import { IsNull } from 'typeorm';
import AppDataSource from '../../config/ormconfig';
import { RequestEntity } from '../../entities/requests.entity';
import { CustomError } from '../../error-handling/error-handling';
import { Order } from '../../entities/order.entity';

const requestRepository = AppDataSource.getRepository(RequestEntity);
const orderRepository = AppDataSource.getRepository(Order);

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicCategory, topic, fullName, email, orderNumber, description } = req.body;
    const userId = req.user.id;
    const filePath = req.file?.path?.replace(/\\/g, '/').replace(/^public\//, '') || null;
    const requestNumber = Math.random().toString(16).substr(2, 8);
    let orderId = null;

    if(orderNumber){
        const order = await orderRepository.findOne({ where: { userId, orderNumber } });
        if(!order) throw new CustomError("Order not found", 404);       
        orderId = order.id;
    }

    const newRequest = requestRepository.create({
        topicCategory,
        topic,
        fullName,
        email,
        orderNumber,
        orderId: orderId || undefined,
        userId,
        requestNumber,
        status: 'new',
        messages: [
          {
            message: description,
            userId,
            filePath: filePath || undefined,
            createdAt: new Date().toISOString()
          }
        ]
      });
      

    await requestRepository.save(newRequest);

    res.status(201).json({
      status: 201,
      message: "Request created successfully",
      data: newRequest
    });
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.user;
    const { page = 1, limit = 10, status, topic } = req.query;

    const where: any = { deletedAt: IsNull() };
    if (status) where.status = status;
    if (topic) where.topic = topic;
     where.userId = userId;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const [requests, total] = await requestRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      relations: ['user', 'order'],
      skip,
      take: limitNumber,
      select: {
        id: true,
        topicCategory: true,
        topic: true,
        fullName: true,
        email: true,
        orderNumber: true,
        status: true,   
        createdAt: true,
        orderId: true,
        requestNumber: true,        
        user: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
        order: {
          id: true,
          orderNumber: true,
          city: true,
        },
        messages: {
          message: true,
          filePath: true,
          createdAt: true,
          adminId: true,
          userId: true,
        }
      }
    });

    res.status(200).json({
      status: 200,
      message: "Requests retrieved successfully",
      data: {
        requests,
        total,
        totalPages: Math.ceil(total / limitNumber),
        currentPage: pageNumber
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const request = await requestRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user', 'order'],
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        topicCategory: true,
        topic: true,
        fullName: true,
        email: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        orderId: true,
        requestNumber: true,
        messages: {
          filePath: true,
          message: true,
          createdAt: true,
          adminId: true,
          userId: true,
        },
        user: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
        order: {
          id: true,
          orderNumber: true,
          city: true,
        },
      }
    });

    if (!request) throw new CustomError("Request not found", 404);

    res.status(200).json({
      status: 200,
      message: "Request retrieved successfully",
      data: request
    });
  } catch (error) {
    next(error);
  }
};

export const updateRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const { message, status } = req.body;
      const filePath = req.file?.path?.replace(/\\/g, '/').replace(/^public\//, '');
  
      if (!message) {
        throw new CustomError("message is required", 400);
      }
  
      const request = await requestRepository.findOne({
        where: { id, deletedAt: IsNull(), userId }
      });
  
      if (!request) throw new CustomError("Request not found", 404);
  
      const newMessage = {
        message,
        filePath,
        userId,
        createdAt: new Date().toISOString()
      };
      request.messages.push(newMessage);
      if(status) request.status = status;
      await requestRepository.save(request);
  
      const updated = await requestRepository.findOne({ where: { id } });
  
      res.status(200).json({
        status: 200,
        message: "Request updated successfully",
        data: updated
      });
    } catch (error) {
      next(error);
    }
};

export const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const request = await requestRepository.findOne({ where: { id, deletedAt: IsNull(), userId } });
    if (!request) throw new CustomError("Request not found", 404);

    await requestRepository.softDelete(id);

    res.status(200).json({
      status: 200,
      message: "Request deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

