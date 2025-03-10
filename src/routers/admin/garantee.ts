import { Router } from "express";
import * as Garantee from "../../controllers/admin/garantee";
import { validateAdminToken } from "../../middlewares/adminValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Garantee
 *   description: Garantee management APIs
 */

/**
 * @swagger
 * /garantee/add:
 *   post:
 *     summary: Create a new garantee
 *     tags: [Garantee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: string
 *                 description: A numeric value as string or a text without digits.
 *               productId:
 *                 type: string
 *             required:
 *               - title
 *               - price
 *               - productId
 *             example:
 *               title: "Garantee 1"
 *               price: "100"
 *               productId: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Garantee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     price:
 *                       type: string
 *                       description: A numeric value as string or a text without digits.
 *                     productId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
 */
router.post("/add", validateAdminToken, Garantee.createGarantee);

/**
 * @swagger
 * /garantee/all:
 *   get:
 *     summary: Get all garantees
 *     tags: [Garantee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Garantees fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       price:
 *                         type: string
 *                         description: A numeric value as string or a text without digits.
 *                       productId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       deletedAt:
 *                         type: string
 *                         format: date-time
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 */
router.get("/all", validateAdminToken, Garantee.getGarantees);

/**
 * @swagger
 * /garantee/update/{id}:
 *   patch:
 *     summary: Update a garantee by ID
 *     tags: [Garantee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Garantee ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: string
 *                 description: A numeric value as string or a text without digits.
 *               productId:
 *                 type: string
 *             example:
 *               title: "Garantee Updated"
 *               price: "150"
 *               productId: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Garantee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     price:
 *                       type: string
 *                       description: A numeric value as string or a text without digits.
 *                     productId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
 */
router.patch("/update/:id", validateAdminToken, Garantee.updateGarantee);

/**
 * @swagger
 * /garantee/delete/{id}:
 *   delete:
 *     summary: Delete a garantee by ID
 *     tags: [Garantee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Garantee ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Garantee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
 */
router.delete("/delete/:id", validateAdminToken, Garantee.deleteGarantee);

export default router;
