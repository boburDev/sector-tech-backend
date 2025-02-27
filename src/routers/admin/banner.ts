// import { Router } from "express";
// import * as BannerController from "../../controllers/admin/banner";
// import { validateAdminToken } from "../../middlewares/adminValidator";
// import { uploadPhoto } from "../../middlewares/multer";

// const router = Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Banners
//  *   description: Banner management APIs
//  */

// /**
//  * @swagger
//  * /banner:
//  *   post:
//  *     summary: Create a new banner
//  *     tags: [Banners]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               imagePath:
//  *                 type: string
//  *               webPage:
//  *                 type: string
//  *               url:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Banner created successfully
//  *       400:
//  *         description: Bad request
//  *       500:
//  *         description: Internal server error
//  */
// router.post("/create", validateAdminToken, uploadPhoto.single("bannerImage"), BannerController.createBanner);

// /**
//  * @swagger
//  * /banner:
//  *   get:
//  *     summary: Get all banners
//  *     tags: [Banners]
//  *     responses:
//  *       200:
//  *         description: List of banners
//  *       500:
//  *         description: Internal server error
//  */
// router.get("/all", validateAdminToken, BannerController.getBanners);

// /**
//  * @swagger
//  * /banner/{id}:
//  *   get:
//  *     summary: Get banner by ID
//  *     tags: [Banners]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Banner ID
//  *     responses:
//  *       200:
//  *         description: Banner data
//  *       404:
//  *         description: Banner not found
//  *       500:
//  *         description: Internal server error
//  */
// router.get("by-id/:id",validateAdminToken, BannerController.getBannerById);

// /**
//  * @swagger
//  * /banner/{id}:
//  *   put:
//  *     summary: Update a banner
//  *     tags: [Banners]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Banner ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               imagePath:
//  *                 type: string
//  *               webPage:
//  *                 type: string
//  *               url:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Banner updated successfully
//  *       404:
//  *         description: Banner not found
//  *       500:
//  *         description: Internal server error
//  */
// router.put("update/:id",validateAdminToken, BannerController.updateBanner);

// /**
//  * @swagger
//  * /banner/{id}:
//  *   delete:
//  *     summary: Delete a banner
//  *     tags: [Banners]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Banner ID
//  *     responses:
//  *       200:
//  *         description: Banner deleted successfully
//  *       404:
//  *         description: Banner not found
//  *       500:
//  *         description: Internal server error
//  */
// router.delete("delete/:id", validateAdminToken, BannerController.deleteBanner);

// export default router;
