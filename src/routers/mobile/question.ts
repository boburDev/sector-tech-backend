import { Router } from 'express';
import * as ProductQuestion from '../../controllers/user/comment_question';
import { validateUserToken } from '../../middlewares/userValidator';
import { validate, validateParams } from '../../middlewares/validate';
import { productIdParamsSchema, productQuestionSchema } from '../../validators/product-comment.validate';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: productQuestion
 *   description: Product question management APIs
 */

/**
 * @swagger
 * /user/question/add:
 *   post:
 *     summary: Add a new product question
 *     tags: [productQuestion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 example: "Is this product suitable for outdoor use?"
 *               productId:
 *                 type: string
 *                 example: "product-uuid"
 *     responses:
 *       201:
 *         description: Product question created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/add", validateUserToken, validate(productQuestionSchema), ProductQuestion.addProductQuestion);

/**
 * @swagger
 * /user/question/by-productId/{productId}:
 *   get:
 *     summary: Get questions by product ID
 *     tags: [productQuestion]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *         example: "product-uuid"
 *     responses:
 *       200:
 *         description: List of questions for the product
 *       500:
 *         description: Internal server error
 */
router.get("/by-productId/:productId", validateParams(productIdParamsSchema), ProductQuestion.getQuestionByProductId);

export default router;
