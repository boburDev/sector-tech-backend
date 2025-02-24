import { Router } from "express";
import * as Brands from "../../controllers/admin/brands";
import { uploadPhoto } from "../../middlewares/multer";
import { validateAdminToken } from "../../middlewares/adminValidator";
import { validate, validateParams } from "../../middlewares/validate";
import { uuidSchema } from "../../validators/admin.validate";
import { brandIdsSchema, categoryIdsSchema } from "../../validators/catalog.validate";

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
router.get("/by-id/:id", validateAdminToken,validateParams(uuidSchema), Brands.getBrandById);

/**
 * @swagger
 * /brand/all:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all brands
 */
router.get("/all", validateAdminToken, Brands.getAllBrands);

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
router.put("/update/:id",validateAdminToken, uploadPhoto.single("logo"), validateParams(uuidSchema), Brands.updateBrand);

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
 * /brand/popular/create:
 *   post:
 *     summary: Mark brands as popular
 *     tags: [Brands]
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
 *                 example: ["brandId1", "brandId2"]
 *     responses:
 *       200:
 *         description: Brands processed successfully
 *       400:
 *         description: Invalid or empty brandIds
 *       404:
 *         description: No brands found
 *       500:
 *         description: Internal server error
 */
router.post("/popular/create", validateAdminToken, validate(brandIdsSchema), Brands.createPopularBrand);

/**
 * @swagger
 * /brand/popular/all:
 *   get:
 *     summary: Get all brands or popular brands
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isPopular
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
router.get("/popular/all",validateAdminToken, Brands.getBrands);


export default router;
