import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { ProductCondition, ProductQuestion, ProductComment, ProductRelevance } from '../../entities/product_details.entity';
import { v4 } from '../../utils/uuid';
import { createSlug } from '../../utils/slug';
import { IsNull } from 'typeorm';
import { CustomError } from '../../error-handling/error-handling';
const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const productRelevanceRepository = AppDataSource.getRepository(ProductRelevance);
const productQuestionRepository = AppDataSource.getRepository(ProductQuestion);
const productCommentRepository = AppDataSource.getRepository(ProductComment);

export const getAllProductConditions = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const productConditions = await productConditionRepository.find({
          where:{ deletedAt: IsNull() },
          select: {
            id: true,
            title: true,
            slug: true
          }
        });
        return res.json({
            data: productConditions,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const getProductConditionById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const productCondition = await productConditionRepository.findOne({
           where: { id, deletedAt: IsNull() },
           select: {
            id: true,
            title: true,
            slug: true
           } 
        });

        if (!productCondition) throw new CustomError('Condition not found', 404);   

        return res.json({
            data: productCondition,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
}

export const createProductCondition = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { title } = req.body;
        const newProductCondition = productConditionRepository.create({ title });
        newProductCondition.slug = createSlug(title);
        await productConditionRepository.save(newProductCondition);
        
        return res.json({
            data: newProductCondition,
            error: null,
            status: 201
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductCondition = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const productCondition = await productConditionRepository.findOne({ where: { id } });
        if (!productCondition) throw new CustomError('Product condition not found', 404);

        productCondition.title = title;
        productCondition.slug = createSlug(title);
        await productConditionRepository.save(productCondition);
        return res.json({
            data: productCondition,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductCondition = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;

    try {
        const productCondition = await productConditionRepository.findOne({ where: { id } });
        if (!productCondition) throw new CustomError('Product condition not found', 404);

        productCondition.deletedAt = new Date();
        await productConditionRepository.save(productCondition);
        return res.json({
            message: 'Product condition deleted successfully',
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
};

export const getAllProductRelavances = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const productRelevances = await productRelevanceRepository.find({
           where: { deletedAt: IsNull() },
           select: {
            id:true,
            title: true,
            slug: true
           }
         });
        return res.json({
            data: productRelevances,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
}

export const getProductRelavanceById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const productRelevance = await productRelevanceRepository.findOne({
           where: { id, deletedAt: IsNull() } ,
           select: {
            id: true,
            title: true,
            slug: true
           }
          });

        if (!productRelevance) throw new CustomError('Relevance not found', 404);
        return res.json({
            data: productRelevance,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
}

export const createProductRelavance = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { title } = req.body;
        const newProductRelevance = productRelevanceRepository.create({ title });
        newProductRelevance.slug = createSlug(title);
        await productRelevanceRepository.save(newProductRelevance);
        return res.json({
            data: newProductRelevance,
            error: null,
            status: 201
        });
    } catch (error) {
        next(error);
    }
}

export const updateProductRelavance = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const productRelevance = await productRelevanceRepository.findOne({
           where: { id, deletedAt: IsNull() } ,
           select: {
              id:true,
              title: true,
              slug: true
           }
          });
        if (!productRelevance) throw new CustomError('Product relevance not found', 404);

        productRelevance.title = title;
        productRelevance.slug = createSlug(title);
        await productRelevanceRepository.save(productRelevance);
        return res.json({
            data: productRelevance,
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
}

export const deleteProductRelavance = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;

    try {
        const productRelevance = await productRelevanceRepository.findOne({ where: { id } });
        if (!productRelevance) throw new CustomError('Product relevance not found', 404);

        productRelevance.deletedAt = new Date();    
        await productRelevanceRepository.save(productRelevance);    
        return res.json({
            message: 'Product relevance deleted successfully',
            error: null,
            status: 200
        });
    } catch (error) {
        next(error);
    }
}

// product Comment Repository
export const addReplyToComment = async (req:Request, res:Response, next: NextFunction):Promise<any> =>  {
    try {
        const { commentId, message } = req.body;
        const { id: adminId } = req.admin;
        const comment = await productCommentRepository.findOneBy({ id: commentId });

        if(!comment) throw new CustomError('Comment not found', 404);

        const newReply = {
            id: v4(),
            adminId,
            message,
            createdAt: new Date()
        }
        comment.reply = [...comment.reply, newReply];

        let savedComment = await productCommentRepository.save(comment);
        return res.status(200).json({data: savedComment, error:null, status: 200});
    } catch (error) {
        next(error);
    }
}

export const updateReplyToComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { commentId, replyId } = req.params;
    const { message } = req.body;

    const comment = await productCommentRepository.findOneBy({ id: commentId, deletedAt: IsNull() });

    if (!comment) throw new CustomError('Comment not found', 404);

    const reply = comment.reply.find(reply => reply.id === replyId);
    if (!reply) throw new CustomError('Reply not found', 404);

    reply.message = message;

    await productCommentRepository.save(comment);
    return res.status(200).json({ data: comment, error: null, status: 200 });
  } catch (error) {
    next(error);
  }
}

export const getAllProductComments = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const comments = await productCommentRepository.find({
      relations: ["user", "products"],
      where: { deletedAt: IsNull() },
      select: {
        id:true,
        body:true,
        reply:true,
        star: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          phone: true,
        },
        products: {
          id: true,
          title: true,
          slug: true,
          articul: true,
          inStock: true,
          price: true,
          mainImage: true,
        },
      },
    });
    return res.status(200).json({data: comments, error: null, status: 200});
  } catch (error) {
    next(error);
  }
};

export const getProductCommentById = async (req: Request,res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const comment = await productCommentRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ["user", "products"],
      select: {
        id:true,
        body: true,
        reply: true,
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

    if (!comment) throw new CustomError('Comment not found', 404);

    return res.status(200).json({data: comment, error: null, status: 200});
  } catch (error) {
    next(error);
  }
};

export const updateProductComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const { body, star } = req.body;

    const comment = await productCommentRepository.findOneBy({ id, deletedAt: IsNull() });
    if (!comment) throw new CustomError('Comment not found', 404);

    if (body) comment.body = body;
    if (star) comment.star = star;

    await productCommentRepository.save(comment);
    const updatedComment = await productCommentRepository.findOne({
      where: { id },
      select: {
        id: true,
        body: true,
        reply: true,
        star: true,
        createdAt: true,
      }
    });

    return res.status(200).json({data: updatedComment, error: null, status: 200 });
  } catch (error) {
    next(error);
  }
};

export const deleteProductComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;

    const comment = await productCommentRepository.findOneBy({ id, deletedAt: IsNull() });
    if (!comment) throw new CustomError('Comment not found', 404);

    comment.deletedAt = new Date();
    await productCommentRepository.save(comment);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCommentByProductId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { productId } = req.params;
    
    const comments = await productCommentRepository.find({
      where: { productId, deletedAt: IsNull() },
      relations: ["user", "products"],
      select: {
        id: true,
        star: true,
        reply: true,
        body: true,
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

    if (comments.length === 0) throw new CustomError('No comments found for this product', 404);

    return res.status(200).json({data: comments, error: null, status: 200});
  } catch (error) {
    next(error);
  }
};

// product Question Repository
export const addReplyToQuestion = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { questionId, message } = req.body;
    const { id: adminId } = req.admin
    const question = await productQuestionRepository.findOneBy({ id: questionId, deletedAt: IsNull() });

    if (!question) throw new CustomError('Question not found', 404);

    const newReply = {
      id: v4(),
      adminId,
      message,
      createdAt: new Date()
    };

    question.reply = [...question.reply, newReply];
    let savedQuestion = await productQuestionRepository.save(question);

    return res.status(200).json({data: savedQuestion, error: null, status: 200});
  } catch (error) {
    next(error);
  }
};

export const getAllProductQuestions = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const questions = await productQuestionRepository.find({
      where: { deletedAt: IsNull() },
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

    return res.status(200).json({ data: questions, error:null, status: 200 });
  } catch (error) {
    next(error);
  }
};

export const getProductQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const question = await productQuestionRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ["user", "products"],
      select: {
        id: true,
        reply: true,
        body: true,
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

    if (!question) throw new CustomError('Question not found', 404);

    return res.status(200).json({ data: question, error: null, status: 200 });
  } catch (error) {
    next(error);
  }
};

export const deleteProductQuestion = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const question = await productQuestionRepository.findOneBy({ id });

    if (!question) throw new CustomError('Question not found', 404);

    question.deletedAt = new Date()
    await productQuestionRepository.save(question);
    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getQuestionByProductId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { productId } = req.params;
    const questions = await productQuestionRepository.find({
      where: { productId, deletedAt: IsNull() },
      relations: ["user", "products"],
      select: {
        id: true,
        reply: true,
        body: true,
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
