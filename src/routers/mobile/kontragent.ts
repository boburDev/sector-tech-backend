import express from "express";
import * as kontragentController from "../../controllers/mobile/kontragent";
import { validateUserToken } from "../../middlewares/userValidator";
import { validate } from "../../middlewares/validate";
import { kontragentSchemaValidator } from "../../validators/user.validator";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Kontragent
 *   description: Kontragent management
 */

/**
 * @swagger
 * /mobile/kontragent/create:
 *   post:
 *     summary: Create a new kontragent
 *     tags: [Kontragent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownershipForm:
 *                 type: string
 *                 description: Ownership type e.g. "Юридическое лицо", "Индивидуальный предприниматель", "Юридическое лицо, обособленное подразделение"
 *               inn:
 *                 type: string
 *                 description: Required for "Юридическое лицо" and "Юридическое лицо, обособленное подразделение"
 *               pnfl:
 *                 type: string
 *                 description: Required for "Индивидуальный предприниматель"
 *               oked:
 *                 type: string
 *               name:
 *                 type: string
 *               legalAddress:
 *                 type: string
 *               isFavorite:
 *                 type: boolean
 *                 description: If true, this kontragent becomes the only favorite for the user
 *               countryOfRegistration:
 *                 type: string
 *                 description: Required for нерезидент kontragent
 *             example:
 *               ownershipForm: "Юридическое лицо"
 *               inn: "123456789"
 *               pnfl: ""
 *               oked: "10122"
 *               name: "Kontragent Name"
 *               legalAddress: "Tashkent, Uzbekistan"
 *               isFavorite: true
 *               countryOfRegistration: ""
 *     responses:
 *       201:
 *         description: Kontragent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
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
 *                   type: number
 */
router.post("/create", validateUserToken, validate(kontragentSchemaValidator), kontragentController.createKontragent);

/**
 * @swagger
 * /mobile/kontragent/all:
 *   get:
 *     summary: Get all kontragents for the authenticated user
 *     tags: [Kontragent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: inn
 *         in: query
 *         description: Inn of the kontragent
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kontragents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       ownershipForm:
 *                         type: string
 *                       inn:
 *                         type: string
 *                       pnfl:
 *                         type: string
 *                       oked:
 *                         type: string
 *                       name:
 *                         type: string
 *                       legalAddress:
 *                         type: string
 *                       isFavorite:
 *                         type: boolean
 *                       countryOfRegistration:
 *                         type: string
 *                       address:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           fullAddress:
 *                             type: string
 *                           country:
 *                             type: string
 *                           region:
 *                             type: string
 *                           district:
 *                             type: string
 *                           street:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *                           deletedAt:
 *                             type: string | null      
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
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
 *                   type: number
 */
router.get("/all", validateUserToken, kontragentController.getKontragents);

/**
 * @swagger
 * /mobile/kontragent/update/{id}:
 *   patch:
 *     summary: Update an existing kontragent (all fields are optional)
 *     tags: [Kontragent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Kontragent ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownershipForm:
 *                 type: string
 *               inn:
 *                 type: string
 *               pnfl:
 *                 type: string
 *               oked:
 *                 type: string
 *               name:
 *                 type: string
 *               legalAddress:
 *                 type: string
 *               isFavorite:
 *                 type: boolean
 *               countryOfRegistration:
 *                 type: string
 *             example:
 *               ownershipForm: "Индивидуальный предприниматель"
 *               pnfl: "987654321"
 *               oked: "202"
 *               name: "Updated Kontragent Name"
 *               legalAddress: "Samarkand, Uzbekistan"
 *               isFavorite: false
 *               countryOfRegistration: ""
 *     responses:
 *       200:
 *         description: Kontragent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
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
 *                   type: number
 */
router.patch("/update/:id", validateUserToken, kontragentController.updateKontragent);

/**
 * @swagger
 * /mobile/kontragent/delete/{id}:
 *   delete:
 *     summary: Delete a kontragent (soft delete)
 *     tags: [Kontragent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Kontragent ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kontragent deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: number
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
 *                   type: number
 */
router.delete("/delete/:id", validateUserToken, kontragentController.deleteKontragent);

/**
 * @swagger
 * /mobile/kontragent/location:
 *   get:
 *     summary: Get location by name
 *     tags: [Kontragent]   
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Name of the location    
 *     responses:
 *       200:
 *         description: Location retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object   
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 error:   
 *                   type: string
 *                 status:
 *                   type: number
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
 *                   type: number
 */
router.get("/location", kontragentController.getLocationbyName);

export default router;
