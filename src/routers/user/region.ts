import { Router } from "express";
import * as Region from "../../controllers/user/region";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Region
 *   description: Region management APIs
 */

/**
 * @swagger
 * /user/region/all:
 *   get:
 *     summary: Get all regions
 *     tags: [Region]   
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Name of the region
 *         required: false
 *         type: string 
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
    