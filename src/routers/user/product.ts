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
 *     summary: Get all products with filtering options
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: recommended
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter products by recommended status
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [new, seller]
 *         description: Filter products by condition type
 *       - in: query
 *         name: revalance
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter products by relevance status
 *       - in: query
 *         name: popular
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter products by popularity
 *     responses:
 *       200:
 *         description: Successfully retrieved product list
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
 *                         format: uuid
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       title:
 *                         type: string
 *                         example: "iPhone 14 Pro"
 *                       slug:
 *                         type: string
 *                         example: "iphone-14-pro"
 *                       articul:
 *                         type: string
 *                         example: "A2650"
 *                       inStock:
 *                         type: boolean
 *                         example: true
 *                       price:
 *                         type: number
 *                         example: 999.99
 *                       mainImage:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       recommended:
 *                         type: boolean
 *                         example: true
 *                       conditions:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "1"
 *                           slug:
 *                             type: string
 *                             example: "new"
 *                           title:
 *                             type: string
 *                             example: "New"
 *                       relevances:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "2"
 *                           slug:
 *                             type: string
 *                             example: "active"
 *                           title:
 *                             type: string
 *                             example: "Active"
 *                       popularProduct:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "3"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: object
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
