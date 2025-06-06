import { Router } from 'express';
import * as ProductComment from '../../controllers/mobile/comment_question';
import { validateUserToken } from '../../middlewares/userValidator';
import { validate, validateParams } from '../../middlewares/validate';
import { productCommentSchema, productIdParamsSchema } from '../../validators/product-comment.validate';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: productComment
 *   description: Comment management APIs
 */

/**
 * @swagger
 * /mobile/comment/add:
 *   post:
 *     summary: Add a new product comment
 *     tags: [productComment]
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
 *                 example: "Great product!"
 *               star:
 *                 type: integer
 *                 example: 5
 *               productId:
 *                 type: string
 *                 example: "product-uuid"
 *     responses:
 *       201:
 *         description: Product comment created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/add', validateUserToken, validate(productCommentSchema), ProductComment.addProductComment)

/**
 * @swagger
 * /mobile/comment/by-productId/{productId}:
 *   get:
 *     summary: Get comments by product ID
 *     tags: [productComment]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of comments for the product
 *       404:
 *         description: No comments found for this product
 *       500:
 *         description: Internal server error
 */
router.get("/by-productId/:productId", validateParams(productIdParamsSchema), ProductComment.getCommentByProductId);

export default router;
