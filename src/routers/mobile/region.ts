import { Router } from "express";
import * as Region from "../../controllers/mobile/region";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Region
 *   description: Region management APIs
 */

/**
 * @swagger
 * /mobile/region/all:
 *   get:
 *     summary: Get all regions
 *     tags: [Region]   
 *     responses:
 *       200:
 *         description: Regions fetched successfully
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
 *                       name:
 *                         type: string
 *                 error:
 *                   type: null
 *                 status:
 *                   type: number   
 */
router.get("/all", Region.getRegions);

export default router;
    