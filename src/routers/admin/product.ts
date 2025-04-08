import express from 'express'
import * as Product from '../../controllers/admin/products';
import { validateAdminToken } from '../../middlewares/adminValidator';
import { uploadPhoto } from '../../middlewares/multer';
import { validate, validateParams } from '../../middlewares/validate';
import { uuidSchema } from '../../validators/admin.validate';
import { productIdParamsSchema } from '../../validators/product-comment.validate';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management APIs
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: recommended
 *         required: false
 *         description: Filter by recommended products
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: popular
 *         required: false
 *         description: Filter by popular products
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: condition
 *         required: false
 *         description: Filter by condition
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: relevance
 *         required: false
 *         description: Filter by relevance
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get('/', validateAdminToken, Product.getProducts);

/** 
 * @swagger
 * /product/filter:
 *   get:
 *     summary: Get products by filter
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productCode
 *         required: false
 *         description: Product code    
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Limit number
 *       - in: query
 *         name: title
 *         required: false
 *         description: Title
 *     responses:   
 *       200:
 *         description: Products fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get('/filter', validateAdminToken, Product.getProductsByFilter);

/**
 * @swagger
 * /product/by-id/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
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
router.get('/by-id/:id', validateAdminToken,  validateParams(uuidSchema), Product.getProductById);

/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/create', validateAdminToken, uploadPhoto.fields([{ name: "productMainImage", maxCount: 1 }, { name: "productImages", maxCount: 10 }, { name: "fullDescriptionImages", maxCount: 15 } ]), Product.createProduct);

/**
 * @swagger
 * /product/create-functional:
 *   post:
 *     summary: Create a functional product (from parsed + modified data)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               articul:
 *                 type: string
 *               productCode:
 *                 type: string
 *               description:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: string
 *               brandId:
 *                 type: integer
 *               conditionId:
 *                 type: integer
 *               relevanceId:
 *                 type: integer
 *               catalogId:
 *                 type: integer
 *               subcatalogId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               garanteeIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               characteristics:
 *                 type: string
 *                 description: JSON stringified array of characteristics
 *               images:
 *                 type: array
 *                 description: Array of image paths from `shopnag/` (will be moved to `products/`)
 *                 items:
 *                   type: string
 *               fullDescriptionImages:
 *                 type: array
 *                 description: Additional images for full description (uploaded as files)
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request
 */
router.post('/create-functional', validateAdminToken, uploadPhoto.fields([{ name: "fullDescriptionImages", maxCount: 15 }]), Product.createProductFunctional);

/**
 * @swagger
 * /product/update/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Product Title"
 *               articul:
 *                 type: string
 *                 example: "ART123"
 *               productCode:
 *                 type: string
 *                 example: "PRD123"
 *               characteristics:
 *                 type: string
 *                 example: '{"size":"L","color":"Red"}'
 *               description:
 *                 type: string
 *                 example: "Short description of the product"
 *               fullDescription:
 *                 type: string
 *                 example: "Detailed full description of the product"
 *               price:
 *                 type: number
 *                 example: 199.99
 *               inStock:
 *                 type: boolean
 *                 example: true
 *               brandId:
 *                 type: string
 *                 example: "brand123"
 *               conditionId:
 *                 type: string
 *                 example: "condition123"
 *               relevanceId:
 *                 type: string
 *                 example: "relevance123"
 *               catalogId:
 *                 type: string
 *                 example: "catalog123"
 *               subcatalogId:
 *                 type: string
 *                 example: "subcatalog123"
 *               categoryId:
 *                 type: string
 *                 example: "category123"
 *               productMainImage:
 *                 type: string
 *                 format: binary
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               fullDescriptionImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated"
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "New Product Title"
 *                     articul:
 *                       type: string
 *                       example: "ART123"
 *                     price:
 *                       type: number
 *                       example: 199.99
 *                     mainImage:
 *                       type: string
 *                       example: "images/main-image.png"
 *       400:
 *         description: Validation error or invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Product or related entity not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.put('/update/:id', validateAdminToken, uploadPhoto.fields([{ name: "productMainImage", maxCount: 1 }, { name: "productImages", maxCount: 10 }, { name: "fullDescriptionImages", maxCount: 15 } ]), Product.updateProduct);

// /**
//  * @swagger
//  * /product/delete/{id}:
//  *   delete:
//  *     summary: Delete a product
//  *     description: Deletes a product (soft delete). Requires authentication.
//  *     tags: [Product]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: Product ID
//  *         schema:
//  *           type: string  # UUID bo‘lsa ham, Swaggerda string sifatida belgilash yaxshiroq
//  *     responses:
//  *       200:
//  *         description: Product deleted successfully
//  *       400:
//  *         description: Invalid ID format
//  *       404:
//  *         description: Product not found
//  *       500:
//  *         description: Internal server error
//  */
// router.delete('/delete/:id', validateAdminToken, validateParams(uuidSchema), Product.deleteProduct);

/**
 * @swagger
 * /product/recommend/toggle:
 *   post:  
 *     summary: Toggle a recommended product
 *     tags: [Product]
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
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Product recommendation toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product recommendation toggled successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *       400:
 *         description: Product ID is required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.post('/recommend/toggle',validate(productIdParamsSchema), validateAdminToken, Product.toggleRecommendedProduct);

/**
 * @swagger
 * /product/popular/toggle:
 *   post:
 *     summary: Toggle a popular product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "12345"   
 *     responses:
 *       200:
 *         description: Popular product toggled successfully
 *       400:
 *         description: Product ID is required
 *       404:
 *         description: Product not found   
 *       500:
 *         description: Internal server error
 */
router.post('/popular/toggle', validateAdminToken, Product.togglePopularProduct);

/**
 * @swagger
 * /product/delete/popular/{id}:
 *   delete:
 *     summary: Delete a popular product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Popular product deleted successfully
 *       400:
 *         description: Product ID is required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/popular/:id', validateAdminToken, validateParams(uuidSchema), Product.deletePopularProduct);

/**
 * @swagger
 * /product/by-slug:
 *   get:
 *     summary: Get products by catalog, subcatalog, and category
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: catalogSlug
 *         required: false
 *         description: Catalog slug
 *       - in: query
 *         name: subcatalogSlug
 *         required: false
 *         description: Subcatalog slug
 *       - in: query
 *         name: categorySlug
 *         required: false  
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       500:   
 *         description: Internal server error
 */
router.get('/by-slug', validateAdminToken, Product.getProductsByCatalogSubcatalogCategory);

/**
 * @swagger
 * /product/popular:
 *   get:
 *     summary: Get popular products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Popular products fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get('/popular/all', validateAdminToken, Product.getPopularProducts);

export default router;

