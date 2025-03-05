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
 * /user/catalog/all:
 *   get:
 *     summary: Get all catalogs with optional subcatalogs and categories
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: catalog
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "true"
 *         description: Include subcatalogs. Default is true.
 *       - in: query
 *         name: subcatalog
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "true"
 *         description: Include subcatalogs. Default is true.
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "true"
 *         description: Include categories. Default is true.
 *     responses:
 *       200:
 *         description: List of all catalogs
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
 *                         example: "a1b2c3d4"
 *                       slug:
 *                         type: string
 *                         example: "example-catalog"
 *                       title:
 *                         type: string
 *                         example: "Example Catalog"
 *                       subcatalogs:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "s1b2c3d4"
 *                             slug:
 *                               type: string
 *                               example: "example-subcatalog"
 *                             title:
 *                               type: string
 *                               example: "Example Subcatalog"
 *                             categories:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     example: "c1b2c3d4"
 *                                   slug:
 *                                     type: string
 *                                     example: "example-category"
 *                                   title:
 *                                     type: string
 *                                     example: "Example Category"
 *       404:
 *         description: Catalog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Catalog not found"
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
