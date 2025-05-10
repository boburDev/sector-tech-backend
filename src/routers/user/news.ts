import { Router } from "express";
import * as News from "../../controllers/user/news";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management APIs
 */

/**
 * @swagger
 * /user/news/all:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: home
 *         schema:
 *           type: boolean
 *         description: Agar home true bo‘lsa, faqat 2 ta yangilik qaytariladi
 *     responses:
 *       200:
 *         description: A list of news
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "News retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       fullDescription:
 *                         type: string
 *                       fullDescriptionImages:
 *                         type: array
 *                         items:
 *                           type: string
 *                       slug:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 */
router.get("/all", News.getAllNews);

/**
 * @swagger
 * /user/news/by-slug/{slug}:
 *   get:
 *     summary: Get news by slug
 *     tags: [News]
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         type: string
 *     responses:   
 *       200:
 *         description: A news by slug
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 content:
 *                   type: string
 *                 image:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.get("/by-slug/:slug", News.getNewsBySlug);

export default router;
