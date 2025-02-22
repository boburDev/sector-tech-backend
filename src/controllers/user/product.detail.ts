import { Request, Response } from 'express';
import AppDataSource from '../../config/ormconfig';
import { ProductCondition, ProductQuestion, ProductComment, PopularProduct, ProductRelevance } from '../../entities/product_details.entity';
import { In } from 'typeorm';
import { Product } from '../../entities/products.entity';
import { productCommentSchema, productQuestionSchema } from '../../validators/product-comment.validate';

const productRepository = AppDataSource.getRepository(Product);
const productConditionRepository = AppDataSource.getRepository(ProductCondition);
const productRelevanceRepository = AppDataSource.getRepository(ProductRelevance);
const popularProductRepository = AppDataSource.getRepository(PopularProduct);
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
        return res.json({
            data: productCondition,
            error: null,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}



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
        return res.json({
            data: productRelevance,
            error: null,
            status: 200
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



// Popular product


export const findAllPopularProducts = async (req: Request,res: Response): Promise<any> => {
    try {
        const popularProducts = await popularProductRepository.find({
          relations: ["products"],
          select: {
            products: {
                id: true,
                title: true,
                slug: true,
                articul: true,
                productCode: true,
                description: true,
                inStock: true,
                price: true,
                mainImage:true
            },
          },
        });
      
        return res.status(200).json({
          data: popularProducts,
          status: 200,
        });
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const findOnePopularProduct = async (req: Request,res: Response): Promise<any> => {
    try {
        const { id } = req.params;
      
        const popularProduct = await popularProductRepository.findOne({
          where: { id },
          relations: ["products"],
          select: {
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
      
        if (!popularProduct) {
          return res.status(404).json({
            data: null,
            error: "Popular product not found",
            status: 404,
          });
        }
      
        return res.status(200).json({
          data: popularProduct,
          status: 200,
        });
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });

    }
};



// product Comment Repository


export const addProductComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error,value } = productCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { commentBody, star, productId, userId } = value;
    const newComment = new ProductComment();
    newComment.commentBody = commentBody;
    newComment.star = star;
    newComment.productId = productId;
    newComment.userId = userId;
    newComment.reply = [];

    const savedComment = await productCommentRepository.save(newComment);
    return res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error creating product comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




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

export const addProductQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error, value } = productQuestionSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { body, productId, userId } = value;
    const newQuestion = new ProductQuestion();
    newQuestion.body = body;
    newQuestion.productId = productId;
    newQuestion.userId = userId;
    newQuestion.reply = [];

    let savedQuestion = await productQuestionRepository.save(newQuestion);
    return res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Error creating product question:", error);
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

