import { Router } from "express";
import * as Product from "../../controllers/user/product";
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
 * /user/cart/toggle-cart:
 *   post:
 *     summary: Toggle cart product status
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: count
 *         in: query
 *         description: "Mahsulotdan nechta qo‘shilishini belgilaydi (ixtiyoriy). Aks holda default = 1"
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "d058b92f-d453-43e5-9337-efc341a4c1bb"
 *     responses:
 *       200:
 *         description: Product removed from cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: Product removed from cart.
 *       201:
 *         description: Product added to cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: Product added to cart successfully.
 *       500:
 *         description: Internal server error
 */
router.post('/toggle-cart', validateUserToken, validate(productIdParamsSchema), Product.toggleCart);

/**
 * @swagger
 * /user/cart/all:
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
router.get('/all', validateUserToken, Product.getProductCarts);

/**
 * @swagger
 * /user/cart/delete:
 *   delete:
 *     summary: Delete all carts user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart deleted successfully.
 *       500:
 *         description: Internal server error
 */     
router.delete('/delete', validateUserToken, Product.deleteCartByUserId);

/**
 * @swagger
 * /user/cart/update-amount:
 *   post:
 *     summary: Update the quantity of a product in the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - count
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "product-uuid"
 *               count:
 *                 type: integer
 *                 example: 2
 *                 minimum: 1
 *                 description: The exact number of items to set in the cart
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Invalid input or stock issue
 *       404:
 *         description: Product or cart item not found
 *       500:
 *         description: Internal server error
 */
router.post('/update-amount', validateUserToken, Product.updateOrAddAmountToCart);

export default router;