import { Router } from "express";
import * as BannerController from "../../controllers/mobile/banner";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management APIs
 */

/**
 * @swagger
 * /mobile/banner/all:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: routePath
 *         required: false
 *         description: Route path to filter banners
 *     responses:
 *       200:
 *         description: List of banners
 *       500:
 *         description: Internal server error
 */
router.get("/all", BannerController.getBanners);

export default router;
