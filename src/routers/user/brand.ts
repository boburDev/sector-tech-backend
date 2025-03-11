import { Router } from "express";
import * as Brands from "../../controllers/user/brand";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management APIs
 */

/**
 * @swagger
 * /user/brand/all:
 *   get:
 *     summary: Get all brands or filter by popular brands
 *     tags: [Brands]
 *     parameters:
 *       - in: query
 *         name: popular
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, returns only popular brands
 *         example: true
 *     responses:
 *       200:
 *         description: List of brands
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
 *                         example: "123"
 *                       title:
 *                         type: string
 *                         example: "Nike"
 *                       path:
 *                         type: string
 *                         example: "images/nike.png"
 *                       popular:
 *                         type: boolean
 *                         example: true
 *                       slug:
 *                         type: string
 *                         example: "nike"
 *                 error:
 *                   type: string
 *                   nullable: true
 *       500:
 *         description: Internal server error
 */
router.get("/all", Brands.getBrands);

/**
 * @swagger
 * /user/brand/{slug}:
 *   get:
 *     summary: Get brand by SLUG
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand SLUG
 *         example: "nike"
 *     responses:
 *       200:
 *         description: Brand details
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
 *                       example: "123"
 *                     title:
 *                       type: string
 *                       example: "Nike"
 *                     path:
 *                       type: string
 *                       example: "images/nike.png"
 *                     slug:
 *                       type: string
 *                       example: "nike"
 *                 error:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
router.get("/:slug", Brands.getBrandById);

export default router;
