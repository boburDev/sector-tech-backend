import { Router } from "express";
import * as BannerController from "../../controllers/user/banner";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management APIs
 */

/**
 * @swagger
 * /user/banner/all:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of banners
 *       500:
 *         description: Internal server error
 */
router.get("/all", BannerController.getBanners);

/**
 * @swagger
 * /user/banner/by-id/{id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner data
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Internal server error
 */
router.get("/by-id/:id", BannerController.getBannerById);

export default router;
