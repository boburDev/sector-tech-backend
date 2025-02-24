import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { ProductCondition, ProductQuestion, ProductComment, ProductRelevance } from '../../entities/product_details.entity';
import { In } from 'typeorm';
import { Product } from '../../entities/products.entity';
import { v4 } from '../../utils/uuid';

const productRepository = AppDataSource.getRepository(Product);
const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const productRelevanceRepository = AppDataSource.getRepository(ProductRelevance);
const productQuestionRepository = AppDataSource.getRepository(ProductQuestion);
const productCommentRepository = AppDataSource.getRepository(ProductComment);

export const getAllProductConditions = async (req: Request, res: Response): Promise<any> => {
    try {
        const productConditions = await productConditionRepository.find({ relations: ['products'] });
        return res.json({
            data: productConditions,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductConditionById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const productCondition = await productConditionRepository.findOne({ where: { id } });

        if (!productCondition) {
          return res.json({
            data: null,
            error: 'Condition not found',
            status: 404
          });
        }

        return res.json({
            data: productCondition,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createProductCondition = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, name } = req.body;
        const newProductCondition = productConditionRepository.create({ title, name });
        await productConditionRepository.save(newProductCondition);
        
        return res.json({
            data: newProductCondition,
            error: null,
            status: 201
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductConditionByName = async (req: Request, res: Response): Promise<any> => {
    try {
        const conditionIds = req.params.name.split(',');

        const productConditions = await productConditionRepository.find({
            where: { id: In(conditionIds) },
            relations: ['products'],
        });

        const result = await Promise.all(
            productConditions.map(async (condition: any) => {
                const productCount = await productRepository.count({
                    where: { conditionId: condition.id },
                });

                return {
                    title: condition.title,
                    name: condition.name,
                    productCount,
                };
            })
        );

        return res.json({
            data: result,
            error: null,
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProductCondition = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, name } = req.body;

    try {
        const productCondition = await productConditionRepository.findOne({ where: { id } });
        if (!productCondition) {
            return res.status(404).json({ message: 'Product condition not found' });
        }

        productCondition.title = title;
        productCondition.name = name;
        await productConditionRepository.save(productCondition);
        return res.json({
            data: productCondition,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteProductCondition = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const productCondition = await productConditionRepository.findOne({ where: { id } });
        if (!productCondition) {
            return res.status(404).json({ message: 'Product condition not found' });
        }

        productCondition.deletedAt = new Date();
        await productConditionRepository.save(productCondition);
        return res.json({
            message: 'Product condition deleted successfully',
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllProductRelavances = async (req: Request, res: Response): Promise<any> => {
    try {
        const productRelevances = await productRelevanceRepository.find({ relations: ['products'] });
        return res.json({
            data: productRelevances,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getProductRelavanceById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const productRelevance = await productRelevanceRepository.findOne({ where: { id } });

        if (!productRelevance) {
          return res.json({
            data: null,
            error: 'Relevance not found',
            status: 404
          });
        }
        return res.json({
            data: productRelevance,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createProductRelavance = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, name } = req.body;
        const newProductRelevance = productRelevanceRepository.create({ title, name });
        await productRelevanceRepository.save(newProductRelevance);
        return res.json({
            data: newProductRelevance,
            error: null,
            status: 201
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getProductRelavanceByName = async (req: Request, res: Response): Promise<any> => {
    try {
        const relevanceIds = req.params.name.split(',');
        const productRelevances = await productRelevanceRepository.find({
            where: { id: In(relevanceIds) },
            relations: ['products'],
        });
        
        const result = await Promise.all(
            productRelevances.map(async (relevance: any) => {
                const productCount = await productRepository.count({
                    where: { relevanceId: relevance.id },
                });

                return {
                    title: relevance.title,
                    name: relevance.name,
                    productCount,
                };
            })
        );

        return res.json({
            data: result,
            error: null,
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}   

export const updateProductRelavance = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, name } = req.body;

    try {
        const productRelevance = await productRelevanceRepository.findOne({ where: { id } });
        if (!productRelevance) {
            return res.status(404).json({ message: 'Product relevance not found' });
        }

        productRelevance.title = title;
        productRelevance.name = name;
        await productRelevanceRepository.save(productRelevance);
        return res.json({
            data: productRelevance,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteProductRelavance = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const productRelevance = await productRelevanceRepository.findOne({ where: { id } });
        if (!productRelevance) {
            return res.status(404).json({ message: 'Product relevance not found' });
        }

        productRelevance.deletedAt = new Date();    
        await productRelevanceRepository.save(productRelevance);    
        return res.json({
            message: 'Product relevance deleted successfully',
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// product Comment Repository
export const addReplyToComment = async (req:Request, res:Response):Promise<any> =>  {
    try {
        const { commentId, message } = req.body;
        // console.log(commentId);
        const { id: adminId } = req.admin;
        const comment = await productCommentRepository.findOneBy({id:commentId});

        if(!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const newReply = {
            id: v4(),
            adminId,
            message,
            createdAt: new Date()
        }
        comment.reply = [...comment.reply, newReply];

        let savedComment = await productCommentRepository.save(comment);
        return res.status(200).json(savedComment);
    } catch (error) {
        console.error("Error adding reply to comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllProductComments = async (req: Request, res: Response): Promise<any> => {
  try {
    const comments = await productCommentRepository.find({
      relations: ["user", "products"],
      select: {
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
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching product comments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductCommentById = async (req: Request,res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const comment = await productCommentRepository.findOne({
      where: { id },
      relations: ["user", "products"],
      select: {
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

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.error("Error fetching product comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProductComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { commentBody, star } = req.body;

    const comment = await productCommentRepository.findOneBy({ id });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.commentBody = commentBody || comment.commentBody;
    comment.star = star || comment.star;

    const updatedComment = await productCommentRepository.save(comment);
    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating product comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProductComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const comment = await productCommentRepository.findOneBy({ id });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await productCommentRepository.remove(comment);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting product comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentByProductId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId } = req.params;
    
    const comments = await productCommentRepository.find({
      where: { productId },
      relations: ["user", "products"],
      select: {
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

    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this product" });
    }

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments by productId:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// product Question Repository
export const addReplyToQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { questionId, message } = req.body;
    const { id: adminId } = req.admin
    const question = await productQuestionRepository.findOneBy({ id: questionId });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const newReply = {
      id: v4(),
      adminId,
      message,
      createdAt: new Date()
    };

    question.reply = [...question.reply, newReply];
    let savedQuestion = await productQuestionRepository.save(question);

    return res.status(200).json(savedQuestion);
  } catch (error) {
    console.error("Error adding reply to question:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProductQuestions = async (req: Request, res: Response): Promise<any> => {
  try {
    const questions = await productQuestionRepository.find({
      relations: ["user", "products"],
      select: {
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

    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductQuestionById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const question = await productQuestionRepository.findOne({
      where: { id },
      relations: ["user", "products"],
      select: {
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

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProductQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const question = await productQuestionRepository.findOneBy({ id });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await productQuestionRepository.remove(question);
    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuestionByProductId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId } = req.params;
    const questions = await productQuestionRepository.find({
      where: { productId },
      relations: ["user", "products"],
      select: {
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

    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions for product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
