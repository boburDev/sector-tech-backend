import { Router } from 'express';
import * as Brands from '../../controllers/brands';
import { uploadPhoto } from '../../middlewares/multer';
import { validateAdminToken } from '../../middlewares/adminValidator';

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
router.get('/by-id/:id', validateAdminToken, Brands.getBrandById);


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
router.get('/all', validateAdminToken, Brands.getAllBrands);


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
router.post('/create', validateAdminToken, uploadPhoto.single('logo'), Brands.createBrand);


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
router.put('/update/:id', validateAdminToken, uploadPhoto.single('logo'), Brands.updateBrand);


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
router.delete('/delete/:id', validateAdminToken, Brands.deleteBrand);




export default router;
