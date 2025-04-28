import express from "express";
import * as Filter from "../../controllers/mobile/catalog";
import * as CatalogFilter from "../../controllers/mobile/catalog_filter";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Filter
 *   description: Filter management APIs
 */

/**
 * @swagger
 * /mobile/filter:
 *   get:
 *     summary: Get filter by optional subcatalog and category
 *     tags: [Filter]   
 *     parameters:
 *       - name: subcatalogSlug
 *         in: query
 *         required: false
 *         type: string
 *         description: (Optional) The slug of the subcatalog.
 *       - name: categorySlug
 *         in: query
 *         required: false  
 *         type: string
 *         description: (Optional) The slug of the category.
 *     responses:
 *       200:
 *         description: Filter by subcatalog and/or category.
 *         schema:
 *           type: object   
 */
router.get("/", Filter.getFilterBySubcatalogCategorySlug);

/**
 * @swagger
 * /mobile/filter/search:
 *   get:
 *     summary: Search product by filter options
 *     tags: [Filter]   
 *     parameters:
 *       - name: subcatalogSlug
 *         in: query
 *         required: false
 *         type: string
 *       - name: categorySlug
 *         in: query
 *         required: false
 *         type: string
 *       - name: options
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Search product by filter options.
 *         schema:
 */
router.get("/search", CatalogFilter.searchProductByCatalogFilter);

export default router;
