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
 * /user/product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/", Product.getProducts);



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
 * /user/product/saved-product/{productId}:
 *   get:
 *     summary: Get saved product by productId for the user
 *     tags: [savedProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           example: "product-uuid"
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Saved product found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                   example: "product-uuid"
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error
 */
router.get('/saved-product/:productId', validateUserToken, validate(productIdParamsSchema), Product.getUserSavedProducts);

export default router;
