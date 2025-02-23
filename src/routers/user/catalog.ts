import express from "express";
import * as Catalog from "../../controllers/user/catalog";
import { validateParams } from "../../middlewares/validate";
import { uuidSchema } from "../../validators/admin.validate";

const router = express.Router();

// Catalog routes
/**
 * @swagger
 * tags:
 *   name: Catalog
 *   description: Catalog management APIs
 */

/**
 * @swagger
 * /user/catalog/with-subcatalogs:
 *   get:
 *     summary: Get all catalogs with subcatalogs
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: List of catalogs
 */
router.get("/with-subcatalogs", Catalog.getAllCatalogs);

/**
 * @swagger
 * /user/catalog/by/{id}:
 *   get:
 *     summary: Get a catalog by ID
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Catalog ID
 *     responses:
 *       200:
 *         description: Catalog details
 *       404:
 *         description: Catalog not found
 */
router.get("/by/:id", validateParams(uuidSchema), Catalog.getCatalogById);

// Subcatalog routes
/**
 * @swagger
 * tags:
 *   name: Subcatalog
 *   description: Subcatalog management APIs
 */

/**
 * @swagger
 * /user/catalog/subcatalog/with-categories/{id}:
 *   get:
 *     summary: Get subcatalog with categories by catalog ID
 *     tags: [Subcatalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Catalog ID
 *     responses:
 *       200:
 *         description: Subcatalog with categories retrieved successfully
 */
router.get("/subcatalog/with-categories/:id", validateParams(uuidSchema), Catalog.getSubcatalogWithCategoryByCatalogId);

/**
 * @swagger
 * /user/catalog/subcatalog/by-id/{id}:
 *   get:
 *     summary: Get subcatalog by ID
 *     tags: [Subcatalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcatalog ID
 *     responses:
 *       200:
 *         description: Subcatalog retrieved successfully
 *       404:
 *         description: Subcatalog not found
 */
router.get("/subcatalog/by-id/:id", validateParams(uuidSchema), Catalog.getSubcatalogById);

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management APIs
 */

// Category routes

/**
 * @swagger
 * /user/catalog/category/by-subcatalog/{id}:
 *   get:
 *     summary: Get categories by subcatalog ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcatalog ID
 *     responses:
 *       200:
 *         description: List of categories
 *       404:
 *         description: Categories not found
 */
router.get("/category/by-subcatalog/:id", validateParams(uuidSchema), Catalog.getCategoriesBySubcatalogId);

/**
 * @swagger
 * /user/catalog/category/all:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: Successful response. Returns a list of categories.
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
 *                         example: "1"
 *                       name:
 *                         type: string
 *                         example: "Electronics"
 *                       slug:
 *                         type: string
 *                         example: "electronics"
 *                 error:
 *                   type: string
 *                   example: null
 *                 status:
 *                   type: number
 *                   example: 200
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
 */

router.get("/category/all", Catalog.getAllCategories);

export default router;
