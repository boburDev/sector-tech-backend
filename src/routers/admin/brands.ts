import { Router } from "express";
import * as Brands from "../../controllers/admin/brands";
import { uploadPhoto } from "../../middlewares/multer";
import { validateAdminToken } from "../../middlewares/adminValidator";
import { validateParams } from "../../middlewares/validate";
import { uuidSchema } from "../../validators/admin.validate";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management APIs
 */

/**
 * @swagger
 * /brand/by-id/{id}:
 *   get:
 *     summary: Get a brand by ID
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand details
 *       404:
 *         description: Brand not found
 */
router.get("/by-id/:id", validateAdminToken, validateParams(uuidSchema), Brands.getBrandById);

/**
 * @swagger
 * /brand/create:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Brand created successfully
 */
router.post( "/create", validateAdminToken, uploadPhoto.single("logo"), Brands.createBrand);

/**
 * @swagger
 * /brand/update/{id}:
 *   put:
 *     summary: Update a brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       404:
 *         description: Brand not found
 */
router.put("/update/:id", validateAdminToken, uploadPhoto.single("logo"), validateParams(uuidSchema), Brands.updateBrand);

/** 
 * @swagger
 * /brand/get-paths:
 *   get:
 *     summary: Get all brand paths
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Brand paths
 *       401:
 *         description: Unauthorized
 */
router.get("/get-paths", validateAdminToken, Brands.getBrandPath);

/**
 * @swagger
 * /brand/update-path/{id}:
 *   put:
 *     summary: Update a brand path
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand path updated successfully
 */
router.put("/update-path/:id", validateAdminToken, validateParams(uuidSchema), Brands.updateBrandPath);

/**
 * @swagger
 * /brand/delete/{id}:
 *   delete:
 *     summary: Delete a brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 */
router.delete("/delete/:id", validateAdminToken, validateParams(uuidSchema), Brands.deleteBrand);

/**
 * @swagger
 * /brand/all:
 *   get:
 *     summary: Get all brands or popular brands
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: popular
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by popular brands (true/false)
 *     responses:
 *       200:
 *         description: List of brands
 *       500:
 *         description: Internal server error
 */
router.get("/all",validateAdminToken, Brands.getBrands);

/**
 * @swagger
 * tags:
 *   name: PopularBrands
 *   description: Popular brand management APIs
 */

/**
 * @swagger
 * /brand/popular/toggle:
 *   post:
 *     summary: Toggle a popular brand
 *     tags: [PopularBrands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Popular brand toggled successfully    
 *       400:
 *         description: Invalid or empty brandIds
 */
router.post("/popular/toggle", validateAdminToken,  Brands.togglePopularBrand);

/**
 * @swagger
 * /brand/popular/delete/{id}:
 *   delete:
 *     summary: Delete a popular brand      
 *     tags: [PopularBrands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id     
 *         required: true
 *         schema:
 *           type: string
 *         description: Popular brand ID
 *     responses:
 *       200:
 *         description: Popular brand deleted successfully
 *       404:
 *         description: Popular brand not found
 */
router.delete("/popular/delete/:id", validateAdminToken, validateParams(uuidSchema), Brands.deletePopularBrand);

/**
 * @swagger
 * /brand/popular/by-id/{id}:
 *   get:
 *     summary: Get a popular brand by ID
 *     tags: [PopularBrands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Popular brand ID
 *     responses:
 *       200:
 *         description: Popular brand details
 *       404:
 *         description: Popular brand not found
 */         
router.get("/popular/by-id/:id", validateAdminToken, validateParams(uuidSchema), Brands.getPopularBrandById);       


export default router;  
