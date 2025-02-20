import { Router } from 'express';
import * as ProductCondition from '../../controllers/product_details';
import { validateAdminToken } from '../../middlewares/adminValidator';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProductCondition
 *   description: Product condition management APIs
 */

/**
 * @swagger
 * /product-detail/condition/all:
 *   get:
 *     summary: Get all product conditions
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of product conditions
 */
router.get('/condition/all', validateAdminToken, ProductCondition.getAllProductConditions)


/**
 * @swagger
 * /product-detail/condition/by-id/{id}:
 *   get:
 *     summary: Get product condition by ID
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product condition ID
 *     responses:
 *       200:
 *         description: Product condition details
 */

router.get('/condition/by-id/:id', validateAdminToken, ProductCondition.getProductConditionById)


/**
 * @swagger
 * /product-detail/condition/by-name/{name}:
 *   get:
 *     summary: Get product conditions by name
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product condition names (comma-separated)
 *     responses:
 *       200:
 *         description: List of product conditions
 */
router.get('/condition/by-name/:name', validateAdminToken, ProductCondition.getProductConditionByName)

/**
 * @swagger
 * /product-detail/condition/create:
 *   post:
 *     summary: Create a product condition
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product condition created successfully
 */
router.post('/condition/create', validateAdminToken, ProductCondition.createProductCondition)


/**
 * @swagger
 * /product-detail/condition/update/{id}:
 *   put:
 *     summary: Update a product condition
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product condition ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product condition updated successfully
 */
router.put('/condition/update/:id', validateAdminToken, ProductCondition.updateProductCondition)


/**
 * @swagger
 * /product-detail/condition/delete/{id}:
 *   delete:
 *     summary: Delete a product condition
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product condition ID
 *     responses:
 *       200:
 *         description: Product condition deleted successfully
 */
router.delete('/condition/delete/:id', validateAdminToken, ProductCondition.deleteProductCondition)
 

// ///////////////////////////////////////////////////////////////////////////


/**
 * @swagger
 * tags:
 *   name: ProductRelavance
 *   description: Product revalance management APIs
 */


/**
 * @swagger
 * /product-detail/relavance/all:
 *   get:
 *     summary: Get all product relevances
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all product relevances
 */
router.get('/relavance/all', validateAdminToken, ProductCondition.getAllProductRelavances)


/**
 * @swagger
 * /product-detail/relavance/{id}:
 *   get:
 *     summary: Get a product relevance by ID
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product relevance ID
 *     responses:
 *       200:
 *         description: Product relevance details
 */
router.get('/relavance/:id', validateAdminToken, ProductCondition.getProductRelavanceById)


/**
 * @swagger
 * /product-detail/relavance/create:
 *   post:
 *     summary: Create a new product relevance
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product relevance created
 */
router.post('/relavance/create', validateAdminToken, ProductCondition.createProductRelavance)
/**
 * @swagger
 * /product-detail/relavance/by-name/{name}:
 *   get:
 *     summary: Get a product relevance by name
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product relevance name
 *     responses:
 *       200:
 *         description: Product relevance details
 *       404:
 *         description: Product relevance not found
 */

router.get('/relavance/by-name/:name', validateAdminToken, ProductCondition.getProductRelavanceByName);


/**
 * @swagger
 * /product-detail/relavance/update/{id}:
 *   put:
 *     summary: Update a product relevance
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product relevance ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product relevance updated
 */
router.put('/relavance/update/:id', validateAdminToken, ProductCondition.updateProductRelavance)


// /**
//  * @swagger
//  * /product-detail/relavance/delete/{id}:
//  *   delete:
//  *     summary: Delete a product relevance
//  *     tags: [ProductRelavance]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Product relevance ID
//  *     responses:
//  *       200:
//  *         description: Product relevance deleted
//  */
router.delete('/relavance/delete/:id', validateAdminToken, ProductCondition.deleteProductRelavance);

export default router;
 