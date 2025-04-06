import express from "express";
import * as Promotion from "../../controllers/user/promotion";
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
 * /mobile/promotion/all:
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of promotions
 */
router.get("/all", Promotion.getPromotions);

/**
 * @swagger
 * /mobile/promotion/{id}:
 *   get:
 *     summary: Get promotion by ID
 *     tags: [Promotions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         format: uuid
 *     responses:
 *       200:
 *         description: Promotion details
 */ 
router.get("/:id", validateParams(uuidSchema), Promotion.getPromotionById);

export default router;
