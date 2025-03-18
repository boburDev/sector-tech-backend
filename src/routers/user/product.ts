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
 *     summary: Retrieve all products with optional filters
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: recommended
 *         schema:
 *           type: boolean
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
 *           type: boolean
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
 *                       catalog:
 *                         type: object
 *                         properties:
 *                           slug:  
 *                             type: string
 *                             example: "catalog-slug"
 *                           title:
 *                             type: string
 *                             example: "Catalog Title"
 *                       subcatalog:
 *                         type: object
 *                         properties:
 *                           slug:          
 *                             type: string
 *                             example: "subcatalog-slug"
 *                           title:
 *                             type: string
 *                             example: "Subcatalog Title"
 *                       category:
 *                         type: object
 *                         properties:
 *                           slug:
 *                             type: string
 *                             example: "category-slug"
 *                           title:
 *                             type: string
 *                             example: "Category Title"
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
 * /user/product/by-slug/{slug}:
 *   get:
 *     summary: Retrieve a product by its SLUG
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the product
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/by-slug/:slug', Product.getProductById);

/**
 * @swagger
 * /user/product/toggle-saved:
 *   post:
 *     summary: Toggle the saved status of a product for the user
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
 *         description: Product removed from saved list
 *       201:
 *         description: Product added to saved list
 *       500:
 *         description: Internal server error
 */
router.post('/toggle-saved', validateUserToken, validate(productIdParamsSchema), Product.toggleSaved);

/**
 * @swagger
 * /user/product/saved-products:
 *   get:
 *     summary: Retrieve all saved products for the user
 *     tags: [savedProduct]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved products retrieved successfully
 *       401:
 *         description: Unauthorized access. Token is missing or invalid.
 *       404:
 *         description: No saved products found.
 *       500:
 *         description: Internal server error
 */
router.get('/saved-products', validateUserToken, Product.getUserSavedProducts);

/**
 * @swagger
 * /user/product/by-slug:
 *   get:
 *     summary: Get products by catalog and category slug with sorting and pagination
 *     description: Fetch products based on catalog, category slugs with additional filters like popular, price, and name sorting.
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: catalogSlug
 *         schema:
 *           type: string
 *         required: false
 *         description: The slug of the catalog
 *       - in: query
 *         name: categorySlug
 *         schema:
 *           type: string
 *         required: false
 *         description: The slug of the category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: The number of products per page (default is 10)
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         required: false
 *         description: Filter products by stock availability ("true" for in stock, "false" for out of stock)
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Search products by title
 *       - in: query
 *         name: popular
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         required: false
 *         description: Sort products by popularity (true for descending, false for ascending)
 *       - in: query
 *         name: price
 *         schema:
 *           type: string
 *           enum: ["asc", "desc"]
 *         required: false
 *         description: Sort products by price (asc for ascending, desc for descending)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           enum: ["asc", "desc"]
 *         required: false
 *         description: Sort products by name (asc for A-Z, desc for Z-A)
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: "Awesome Product"
 *                           slug:
 *                             type: string
 *                             example: "awesome-product"
 *                           articul:
 *                             type: string
 *                             example: "ART12345"
 *                           inStock:
 *                             type: boolean
 *                             example: true
 *                           price:
 *                             type: number
 *                             example: 99.99
 *                           mainImage:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           category:
 *                             type: object
 *                             properties:
 *                               slug:
 *                                 type: string
 *                                 example: "electronics"
 *                           catalog:
 *                             type: object
 *                             properties:
 *                               slug:
 *                                 type: string
 *                                 example: "home-appliances"
 *                           subcatalog:
 *                             type: object
 *                             properties:
 *                               slug:
 *                                 type: string
 *                                 example: "kitchen"
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     pageNumber:
 *                       type: integer
 *                       example: 1
 *                     limitNumber:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10        
 *       500:
 *         description: Internal Server Error
 */
router.get('/by-slug', Product.getProductsByCatalogSubcatalogCategory);

export default router;
