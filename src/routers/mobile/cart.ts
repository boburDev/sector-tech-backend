import { Router } from "express";
import * as Cart from "../../controllers/mobile/product";
import { validateUserToken } from "../../middlewares/userValidator";
import { validate } from "../../middlewares/validate";
import { productIdParamsSchema } from "../../validators/product-comment.validate";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management APIs
 */

/**
 * @swagger
 * /mobile/cart/toggle-cart:
 *   post:
 *     summary: Toggle cart product status
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "product-uuid"
 *     responses:
 *       200:
 *         description: Product removed from cart.
 *       201:
 *         description: Product added to cart successfully.
 *       500:
 *         description: Internal server error
 */
router.post('/toggle-cart', validateUserToken, validate(productIdParamsSchema), Cart.toggleCart);

/**
 * @swagger
 * /mobile/cart/all:
 *   get:
 *     summary: Get all carts user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart products retrieved successfully.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: No products found in the user's cart.
 *       500:
 *         description: Internal server error
 */
router.get('/all', validateUserToken, Cart.getProductCarts);

export default router;