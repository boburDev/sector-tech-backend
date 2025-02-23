import express from "express";
import * as CatalogFilter from "../../controllers/user/catalog_filter";
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
 * /user/catalog-filter/by/{id}:
 *   get:
 *     summary: Get catalog filter by ID
 *     tags: [CatalogFilter]
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
router.get("/by/:id", validateParams(uuidSchema), CatalogFilter.getCatalogFilterById);



export default router;
