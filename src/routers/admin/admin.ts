import express from "express";
import * as Admin from "../../controllers/admin/admin";
import { loginAttemptLimiter } from "../../middlewares/attemptLimiter";
import { validateAdminToken } from "../../middlewares/adminValidator";
import { validate, validateParams } from "../../middlewares/validate";
import {  adminLoginValidateSchema, adminUpdateValidateSchema, adminValidateSchema, uuidSchema } from "../../validators/admin.validate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post("/login", validate(adminLoginValidateSchema), loginAttemptLimiter, Admin.login);

/**
 * @swagger
 * /admin/create:
 *   post:
 *     summary: Create an admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.post("/create", validateAdminToken,validate(adminValidateSchema), Admin.createAdmin);

/**
 * @swagger
 * /admin/all:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all admins
 */
router.get("/all", validateAdminToken, Admin.getAdmins);

/**
 * @swagger
 * /admin/by-id/{id}:
 *   get:
 *     summary: Get an admin by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin details
 *       404:
 *         description: Admin not found
 */
router.get("/by-id/:id", validateAdminToken,  validateParams(uuidSchema),Admin.getAdminById);

/**
 * @swagger
 * /admin/update/{id}:
 *   put:
 *     summary: Update an admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 */
router.put("/update/:id", validateAdminToken,validate(adminUpdateValidateSchema), validateParams(uuidSchema), Admin.updateAdmin);

/**
 * @swagger
 * /admin/delete/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 */
router.delete("/delete/:id", validateAdminToken,  validateParams(uuidSchema), Admin.deleteAdmin);

/**
 * @swagger
 * /admin/users/all:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
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
 *                         example: "a1b2c3d4"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+1234567890"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/users/all", validateAdminToken, Admin.getAllUsers);

export default router;
