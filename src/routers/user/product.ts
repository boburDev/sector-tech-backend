import { Router } from "express";
import * as Product from "../../controllers/user/product";
import { validateUserToken } from "../../middlewares/userValidator";
import { validate } from "../../middlewares/validate";
import { productIdParamsSchema } from "../../validators/product-comment.validate";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management APIs
 */

/**
 * @swagger
 * /user/product/all:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: condition
 *         schema:
 *           type: boolean
 *         description: Include condition relations if true
 *         example: true
 *       - in: query
 *         name: revalance
 *         schema:
 *           type: boolean
 *         description: Include relevance relations if true
 *         example: false
 *       - in: query
 *         name: recommended
 *         schema:
 *           type: boolean
 *         description: Filter products that are recommended
 *         example: true
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "12345"
 *                       title:
 *                         type: string
 *                         example: "Awesome Product"
 *                       slug:
 *                         type: string
 *                         example: "awesome-product"
 *                       inStock:
 *                         type: boolean
 *                         example: true
 *                       price:
 *                         type: number
 *                         example: 199.99
 *                       mainImage:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       recommended:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Internal server error
 */
router.get("/all", Product.getProducts);

/**
 * @swagger
 * /user/product/by-id/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/by-id/:id', Product.getProductById);

/**
 * @swagger
 * /user/product/toggle-saved:
 *   post:
 *     summary: Toggle saved product status
 *     tags: [savedProduct]
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
 *         description: Product removed from saved.
 *       201:
 *         description: Product saved successfully.
 *       500:
 *         description: Internal server error
 */
router.post('/toggle-saved', validateUserToken,validate(productIdParamsSchema), Product.toggleSaved);

/**
 * @swagger
 * /user/product/saved-products:
 *   get:
 *     summary: Get saved products
 *     tags: [savedProduct]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved product found.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error
 */
router.get('/saved-products', validateUserToken, Product.getUserSavedProducts);

export default router;
