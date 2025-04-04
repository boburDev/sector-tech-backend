import express from "express";
import * as Filter from "../../controllers/user/catalog";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Filter
 *   description: Filter management APIs
 */

/**
 * @swagger
 * /user/filter:
 *   get:
 *     summary: Get filter by optional subcatalog and category
 *     tags: [Filter]
 *     parameters:
 *       - name: subcatalogId
 *         in: query
 *         required: false
 *         type: string
 *         description: (Optional) The ID of the subcatalog.
 *       - name: categoryId
 *         in: query
 *         required: false
 *         type: string
 *         description: (Optional) The ID of the category.
 *     responses:
 *       200:
 *         description: Filter by subcatalog and/or category.
 *         schema:
 *           type: object
 */

router.get("/", Filter.getFilterBySubcatalogCategoryId);

export default router;
