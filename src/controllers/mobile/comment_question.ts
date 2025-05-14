import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { ProductQuestion, ProductComment } from '../../entities/product_details.entity';
import { IsNull } from 'typeorm';

const productQuestionRepository = AppDataSource.getRepository(ProductQuestion);
const productCommentRepository = AppDataSource.getRepository(ProductComment);

// product Comment Repository
export const addProductComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id: userId } = req.user
    const { body, star, productId } = req.body;

    const newComment = new ProductComment();
    newComment.body = body;
    newComment.star = star;
    newComment.productId = productId;
    newComment.userId = userId;

    const savedComment = await productCommentRepository.save(newComment);

    const { deletedAt, ...comment } = savedComment;

    return res.status(201).json({
      data: comment,
      error: null,
      status: 201
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentByProductId = async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
  try {
    const { productId } = req.params;
    
    const comments = await productCommentRepository.find({
      where: { productId, deletedAt: IsNull() },
      order: { createdAt: "DESC" } ,
      relations: ["user", "products"],
      select: {
        id: true,
        reply: true,
        body: true,
        star: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
        products: {
          id: true,
          title: true,
          slug: true,
          articul: true,
          productCode: true,
          description: true,
          inStock: true,
          price: true,
          mainImage: true,
        },
      },
    });

    const totalStars = comments.reduce((sum, item) => sum + (item.star || 0), 0);
    const mediaStar = comments.length > 0 ? +(totalStars / comments.length).toFixed(1) : 0;

    return res.status(200).json({data: { comments, mediaStar }, error:null, status: 200 });
  } catch (error) {
    next(error);
  }
};
// product Question Repository
export const addProductQuestion = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id: userId } = req.user
    const { body, productId } = req.body;

    const newQuestion = new ProductQuestion();
    newQuestion.body = body;
    newQuestion.productId = productId;
    newQuestion.userId = userId;
    let savedQuestion = await productQuestionRepository.save(newQuestion);

    return res.status(201).json({data: savedQuestion, error: null, status: 200 });
  } catch (error) {
    next(error);
  }
};

export const getQuestionByProductId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { productId } = req.params;
    const questions = await productQuestionRepository.find({
      where: { productId, deletedAt: IsNull() },
      order: { createdAt: "DESC" },
      relations: ["user", "products"],
      select: {
        id: true,
        body: true,
        reply: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
        products: {
          id: true,
          title: true,
          slug: true,
          articul: true,
          productCode: true,
          description: true,
          inStock: true,
          price: true,
          mainImage: true,
        },
      },
    });
    

    return res.status(200).json({ data: questions, error: null, status: 200 });
  } catch (error) {
    next(error);
  }
};
