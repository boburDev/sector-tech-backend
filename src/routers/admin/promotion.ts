import express from "express";
import * as Promotion from "../../controllers/admin/promotion";
import { validateAdminToken } from "../../middlewares/adminValidator";
import { uploadPhoto } from "../../middlewares/multer";
import { validateParams } from "../../middlewares/validate";
import { uuidSchema } from "../../validators/admin.validate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Promotion management APIs
 */

/**
 * @swagger
 * /promotion/create:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - expireDate
 *               - coverImage
 *               - promotionBannerImage
 *             properties:
 *               title:
 *                 type: string
 *               expireDate:
 *                 type: string
 *                 format: date-time
 *               fullDescription:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               promotionBannerImage:
 *                 type: string
 *                 format: binary
 *               promotionDescriptionImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Promotion created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/create", validateAdminToken, uploadPhoto.fields([{ name: "coverImage", maxCount: 1 }, { name: "promotionBannerImage", maxCount: 1 }, { name: "promotionDescriptionImages", maxCount: 5 }]), Promotion.createPromotion);

/**
 * @swagger
 * /promotion/all:
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of promotions
 *       401:
 *         description: Unauthorized
 */
router.get("/all", validateAdminToken, Promotion.getPromotions);

/**
 * @swagger
 * /promotion/{id}:
 *   get:
 *     summary: Get promotion by ID
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion details
 *       404:
 *         description: Promotion not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", validateAdminToken, Promotion.getPromotionById);

/**
 * @swagger
 * /promotion/{id}:
 *   patch:
 *     summary: Update promotion by ID
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               expireDate:
 *                 type: string
 *                 format: date-time
 *               fullDescription:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               promotionBannerImage:
 *                 type: string
 *                 format: binary
 *               promotionDescriptionImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *       404:
 *         description: Promotion not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id", validateAdminToken, uploadPhoto.fields([{ name: "coverImage", maxCount: 1 }, { name: "promotionBannerImage", maxCount: 1 }, { name: "promotionDescriptionImages", maxCount: 5 }]), Promotion.updatePromotion);

/**
 * @swagger
 * /promotion/{id}:
 *   delete:
 *     summary: Delete promotion by ID
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Promotion deleted successfully
 *       404:
 *         description: Promotion not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", validateAdminToken, validateParams(uuidSchema), Promotion.deletePromotion);

export default router;