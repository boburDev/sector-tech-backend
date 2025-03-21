import { Router } from "express";
import * as fetchData from "../../controllers/admin/fetch_data";
import { validateAdminToken } from "../../middlewares/adminValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ShopNag
 *   description: Scrape product data from shopnag.uz
 */

/**
 * @swagger
 * /fetch-data/extract:
 *   post:
 *     summary: Extract product data from shopnag.uz by URL
 *     tags: [ShopNag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL of the shopnag.uz product page
 *             required:
 *               - url
 *             example:
 *               url: "https://shopnag.uz/product/some-product-id"
 *     responses:
 *       201:
 *         description: Product data extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     price:
 *                       type: string
 *                     stock:
 *                       type: string
 *                     description:
 *                       type: string
 *                     code:
 *                       type: string
 *                     article:
 *                       type: string
 *                     characteristics:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           option:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 title:
 *                                   type: string
 *                                 value:
 *                                   type: string
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
 *       400:
 *         description: Invalid request or URL is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
 */
router.post("/extract", fetchData.fetchDataFromShopNag);

export default router;

