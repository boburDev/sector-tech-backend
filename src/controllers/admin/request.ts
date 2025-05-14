import { Request, Response, NextFunction } from 'express';
import { ILike, IsNull } from 'typeorm';
import AppDataSource from '../../config/ormconfig';
import { RequestEntity } from '../../entities/requests.entity';
import { CustomError } from '../../error-handling/error-handling';

const requestRepository = AppDataSource.getRepository(RequestEntity);

export const replyRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { id: adminId } = req.admin;
      const { message, status } = req.body;
      const filePath = req.file?.path?.replace(/\\/g, '/').replace(/^public\//, '');
  
      if (!message) {
        throw new CustomError("message is required", 400);
      }
  
      const request = await requestRepository.findOne({
        where: { id, deletedAt: IsNull() }
      });
  
      if (!request) throw new CustomError("Request not found", 404);
  
      const newMessage = {
        message,
        filePath,
        adminId,
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
  
      const request = await requestRepository.findOne({ where: { id, deletedAt: IsNull() } });
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

export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, status, topic, topicCategory } = req.query;
  
      const where: any = { deletedAt: IsNull() };
      if (status) where.status = status;
      if (topic) where.topic = ILike(`%${topic}%`);
      if (topicCategory) where.topicCategory = topicCategory;
  
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
          watched: true,        
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
        watched: true,     
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
    request.watched = true;
    requestRepository.save(request)
    res.status(200).json({
      status: 200,
      message: "Request retrieved successfully",
      data: request
    });
  } catch (error) {
    next(error);
  }
};