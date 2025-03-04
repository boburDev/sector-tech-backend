import express from "express";
import * as Popular from "../../controllers/user/popular";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Popular
 *     description: Popular management APIs
 */

/**
 * @swagger
 * /user/popular/all:
 *   get:
 *     summary: Get popular categories and brands
 *     tags: [Popular]
 *     responses:
 *       200:
 *         description: A list of popular categories and brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 brands:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *                 error:
 *                   type: string
 *                 status:
 *                   type: integer
 *       500:
 *         description: Internal server error
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
 *                   type: integer
 */

router.get("/all", Popular.getPopular);

export default router;
