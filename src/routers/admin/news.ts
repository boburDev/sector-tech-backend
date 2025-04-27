import { Router } from "express";
import * as News from "../../controllers/admin/news";
import { validateAdminToken } from "../../middlewares/adminValidator";
import { uploadPhoto } from "../../middlewares/multer";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: News
 *   description: News CRUD operations
 */

/**
 * @swagger
 * /news/create:
 *   post:
 *     summary: Create a news article
 *     tags: [News]
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
 *               description:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               newsFullDescriptionImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: News created successfully
 */
router.post("/create", validateAdminToken, uploadPhoto.fields([{ name: "newsFullDescriptionImages", maxCount: 5 }]), News.createNews);

/**
 * @swagger
 * /news/update/{id}:
 *   patch:
 *     summary: Update a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               slug:
 *                 type: string
 *               newsFullDescriptionImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: News updated successfully
 */
router.patch("/update/:id", validateAdminToken, uploadPhoto.fields([{ name: "newsFullDescriptionImages", maxCount: 5 }]), News.updateNews);

/**
 * @swagger
 * /news/delete/{id}:
 *   delete:
 *     summary: Soft delete a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     responses:
 *       200:
 *         description: News deleted successfully
 */
router.delete("/delete/:id", validateAdminToken, News.deleteNews);

/**
 * @swagger
 * /news/get-all:
 *   get:
 *     summary: Get all news articles
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: News retrieved successfully
 */
router.get("/get-all", validateAdminToken, News.getAllNews);

/**
 * @swagger
 * /news/get-by-id/{id}:
 *   get:
 *     summary: Get a news article by ID
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     responses:
 *       200:
 *         description: News retrieved successfully
 */
router.get("/get-by-id/:id", validateAdminToken, News.getNewsById);

export default router;
