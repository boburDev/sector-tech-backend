import express from "express";
import * as CatalogFilter from "../../controllers/admin/catalog_filter";
import { validateAdminToken } from "../../middlewares/adminValidator";
import { validateParams } from "../../middlewares/validate";
import { uuidSchema } from "../../validators/admin.validate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CatalogFilter
 *   description: Catalog Filter management APIs
 */

/**
 * @swagger
 * /catalog-filter/by/{id}:
 *   get:
 *     summary: Get catalog filter by ID
 *     tags: [CatalogFilter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Catalog Filter ID
 *     responses:
 *       200:
 *         description: Catalog Filter details
 *       404:
 *         description: Catalog Filter not found
 */
router.get("/by/:id", validateAdminToken, validateParams(uuidSchema), CatalogFilter.getCatalogFilterById);

/**
 * @swagger
 * /catalog-filter/create:
 *   post:
 *     summary: Create a new catalog filter
 *     tags: [CatalogFilter]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcatalogId:
 *                 type: string
 *                 nullable: true
 *               categoryId:
 *                 type: string
 *                 nullable: true
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Catalog Filter created successfully
 */
router.post("/create", validateAdminToken, CatalogFilter.createCatalogFilter);

/**
 * @swagger
 * /catalog-filter/update/{id}:
 *   put:
 *     summary: Update a catalog filter
 *     tags: [CatalogFilter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Catalog Filter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Catalog Filter updated successfully
 *       404:
 *         description: Catalog Filter not found
 */
router.put("/update/:id",validateAdminToken,validateParams(uuidSchema), CatalogFilter.updateCatalogFilter);

/**
 * @swagger
 * /catalog-filter/delete/{id}:
 *   delete:
 *     summary: Delete a catalog filter
 *     tags: [CatalogFilter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Catalog Filter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               deleteFilter:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       200:
 *         description: Catalog Filter deleted successfully
 *       404:
 *         description: Catalog Filter not found
 */
router.delete("/delete/:id",validateAdminToken, validateParams(uuidSchema), CatalogFilter.deleteCatalogFilter);

export default router;
