import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { ProductCondition, ProductQuestion, ProductComment, ProductRelevance } from '../../entities/product_details.entity';
import { v4 } from '../../utils/uuid';
import { createSlug } from '../../utils/slug';
import { IsNull } from 'typeorm';

const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const productRelevanceRepository = AppDataSource.getRepository(ProductRelevance);
const productQuestionRepository = AppDataSource.getRepository(ProductQuestion);
const productCommentRepository = AppDataSource.getRepository(ProductComment);

export const getAllProductConditions = async (req: Request, res: Response): Promise<any> => {
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
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getProductConditionById = async (req: Request, res: Response): Promise<any> => {
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
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const createProductCondition = async (req: Request, res: Response): Promise<any> => {
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
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const updateProductCondition = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const productCondition = await productConditionRepository.findOne({ where: { id } });
        if (!productCondition) {
            return res.status(404).json({ message: 'Product condition not found' });
        }

        productCondition.title = title;
        productCondition.slug = createSlug(title);
        await productConditionRepository.save(productCondition);
        return res.json({
            data: productCondition,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
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
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getAllProductRelavances = async (req: Request, res: Response): Promise<any> => {
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
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const getProductRelavanceById = async (req: Request, res: Response): Promise<any> => {
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
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const createProductRelavance = async (req: Request, res: Response): Promise<any> => {
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
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const updateProductRelavance = async (req: Request, res: Response): Promise<any> => {
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
        if (!productRelevance) {
            return res.status(404).json({ message: 'Product relevance not found' });
        }

        productRelevance.title = title;
        productRelevance.slug = createSlug(title);
        await productRelevanceRepository.save(productRelevance);
        return res.json({
            data: productRelevance,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
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
        return res.status(500).json({ message: "Internal server error", error });
    }
}

// product Comment Repository
export const addReplyToComment = async (req:Request, res:Response):Promise<any> =>  {
    try {
        const { commentId, message } = req.body;
        // console.log(commentId);
        const { id: adminId } = req.admin;
        const comment = await productCommentRepository.findOneBy({ id: commentId });

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
        return res.status(200).json({data: savedComment, error:null, status: 200});
    } catch (error) {
        console.error("Error adding reply to comment:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const getAllProductComments = async (req: Request, res: Response): Promise<any> => {
  try {
    const comments = await productCommentRepository.find({
      relations: ["user", "products"],
      where: { deletedAt: IsNull() },
      select: {
        id:true,
        commentBody:true,
        reply:true,
        star: true,
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
    return res.status(200).json({data: comments, error: null, status: 200});
  } catch (error) {
    console.error("Error fetching product comments:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getProductCommentById = async (req: Request,res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const comment = await productCommentRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ["user", "products"],
      select: {
        id:true,
        commentBody: true,
        reply: true,
        star: true,
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

    return res.status(200).json({data: comment, error: null, status: 200});
  } catch (error) {
    console.error("Error fetching product comment:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateProductComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { commentBody, star } = req.body;

    const comment = await productCommentRepository.findOneBy({ id, deletedAt: IsNull() });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (commentBody) {
      comment.commentBody = commentBody;
    }
    if (star) {
      comment.star = star;
    }

    await productCommentRepository.save(comment);
    const updatedComment = await productCommentRepository.findOne({
      where: { id },
      select: {
        id: true,
        commentBody: true,
        reply: true,
        star: true,
      }
    });

    return res.status(200).json({data: updatedComment, error: null, status: 200 });
  } catch (error) {
    console.error("Error updating product comment:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteProductComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const comment = await productCommentRepository.findOneBy({ id, deletedAt: IsNull() });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    comment.deletedAt = new Date();
    await productCommentRepository.save(comment);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting product comment:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getCommentByProductId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId } = req.params;
    
    const comments = await productCommentRepository.find({
      where: { productId, deletedAt: IsNull() },
      relations: ["user", "products"],
      select: {
        id: true,
        star: true,
        reply: true,
        commentBody: true,
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

    return res.status(200).json({data: comments, error: null, status: 200});
  } catch (error) {
    console.error("Error fetching comments by productId:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// product Question Repository
export const addReplyToQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { questionId, message } = req.body;
    const { id: adminId } = req.admin
    const question = await productQuestionRepository.findOneBy({ id: questionId, deletedAt: IsNull() });

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

    return res.status(200).json({data: savedQuestion, error: null, status: 200});
  } catch (error) {
    console.error("Error adding reply to question:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllProductQuestions = async (req: Request, res: Response): Promise<any> => {
  try {
    const questions = await productQuestionRepository.find({
      where: { deletedAt: IsNull() },
      relations: ["user", "products"],
      select: {
        id: true,
        body: true,
        reply: true,
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
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getProductQuestionById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const question = await productQuestionRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ["user", "products"],
      select: {
        id: true,
        reply: true,
        body: true,
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

    return res.status(200).json({ data: question, error: null, status: 200 });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteProductQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const question = await productQuestionRepository.findOneBy({ id });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    question.deletedAt = new Date()
    await productQuestionRepository.save(question);
    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getQuestionByProductId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId } = req.params;
    const questions = await productQuestionRepository.find({
      where: { productId, deletedAt: IsNull() },
      relations: ["user", "products"],
      select: {
        id: true,
        reply: true,
        body: true,
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
    console.error("Error fetching questions for product:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
