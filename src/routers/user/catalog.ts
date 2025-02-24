import express from "express";
import * as Catalog from "../../controllers/user/catalog";

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
 * /user/catalog/category/all:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     tags:
 *       - Catalog
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

/**
 * @swagger
 * /user/catalog/all:
 *   get:
 *     summary: Get all catalogs with subcatalogs and categories
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: List of catalogs with subcatalogs and categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Catalog ID
 *                   slug:
 *                     type: string
 *                     description: Catalog slug
 *                   title:
 *                     type: string
 *                     description: Catalog title
 *                   subcatalogs:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Subcatalog ID
 *                         title:
 *                           type: string
 *                           description: Subcatalog title
 *                         slug:
 *                           type: string
 *                           description: Subcatalog slug
 *                         categories:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 description: Category ID
 *                               slug:
 *                                 type: string
 *                                 description: Category slug
 *                               title:
 *                                 type: string
 *                                 description: Category title
 *       404:
 *         description: Catalog not found
 *       500:
 *         description: Internal server error
 */
router.get("/all", Catalog.getCatalogs);

/**
 * @swagger
 * /user/catalog/category/by-subcatalog/{subCatalogSlug}:
 *   get:
 *     summary: Get categories by subcatalog slug
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: subCatalogSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the subcatalog
 *     responses:
 *       200:
 *         description: List of categories associated with the subcatalog
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Category ID
 *                   slug:
 *                     type: string
 *                     description: Category slug
 *                   title:
 *                     type: string
 *                     description: Category title
 *                   subCatalog:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Subcatalog ID
 *                       slug:
 *                         type: string
 *                         description: Subcatalog slug
 *                       title:
 *                         type: string
 *                         description: Subcatalog title
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get("/category/by-subcatalog/:subCatalogSlug", Catalog.getCategoryBySubCatalogSlug);

/**
 * @swagger
 * /user/catalog/subcatalog/by-catalog/{catalogSlug}:
 *   get:
 *     summary: Get a subcatalog by catalog slug
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: catalogSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the catalog
 *     responses:
 *       200:
 *         description: Subcatalog details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Subcatalog ID
 *                 slug:
 *                   type: string
 *                   description: Subcatalog slug
 *                 title:
 *                   type: string
 *                   description: Subcatalog title
 *                 catalog:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Catalog ID
 *                     slug:
 *                       type: string
 *                       description: Catalog slug
 *                     title:
 *                       type: string
 *                       description: Catalog title
 *       404:
 *         description: Subcatalog not found
 *       500:
 *         description: Internal server error
 */
router.get("/subcatalog/by-catalog/:catalogSlug", Catalog.getSubCatalogByCatalogSlug);

export default router;
