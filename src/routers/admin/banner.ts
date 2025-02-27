import { Router } from "express";
import * as BannerController from "../../controllers/admin/banner";
import { validateAdminToken } from "../../middlewares/adminValidator";
import { uploadPhoto } from "../../middlewares/multer";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management APIs
 */

/**
 * @swagger
 * /banner/create:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               routePath:
 *                 type: string
 *               redirectUrl:
 *                 type: string
 *               bannerImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Banner created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/create", validateAdminToken, uploadPhoto.single("bannerImage"), BannerController.createBanner);

/**
 * @swagger
 * /banner/all:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of banners
 *       500:
 *         description: Internal server error
 */
router.get("/all", validateAdminToken, BannerController.getBanners);

/**
 * @swagger
 * /banner/by-id/{id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
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
router.get("/by-id/:id", validateAdminToken, BannerController.getBannerById);

/**
 * @swagger
 * /banner/update/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               routePath:
 *                 type: string
 *               redirectUrl:
 *                 type: string
 *               bannerImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Internal server error
 */
router.put("/update/:id", validateAdminToken, uploadPhoto.single("bannerImage"), BannerController.updateBanner);

/**
 * @swagger
 * /banner/delete/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", validateAdminToken, BannerController.deleteBanner);

export default router;
