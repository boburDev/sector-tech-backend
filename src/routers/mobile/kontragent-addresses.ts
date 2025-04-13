import express from "express";
import * as kontragentAddressController from "../../controllers/mobile/kontragent";
import { validateUserToken } from "../../middlewares/userValidator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: KontragentAddresses
 *   description: Kontragent addresses management
 */

/**
 * @swagger
 * /mobile/kontragent-address/save/{id}:
 *   post:
 *     summary: Create or update a kontragent address (toggle style)
 *     tags: [KontragentAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Kontragent ID (required for toggling create/update)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullAddress:
 *                 type: string
 *               country:
 *                 type: string
 *               region:
 *                 type: string
 *               district:
 *                 type: string
 *               street:
 *                 type: string
 *               house:
 *                 type: string
 *               apartment:
 *                 type: string
 *               index:
 *                 type: string
 *               comment:
 *                 type: string
 *               isMain:
 *                 type: boolean
 *             example:
 *               fullAddress: "Tashkent, Olmazor tumani, Chilonzor-9, 12-uy"
 *               country: "UZ"
 *               region: "Tashkent"
 *               district: "Olmazor"
 *               street: "Chilonzor"
 *               house: "9"
 *               apartment: "12"
 *               index: "100115"
 *               comment: "Yangi filial"
 *               isMain: false
 *     responses:
 *       200:
 *         description: Address successfully updated
 *       201:
 *         description: Address successfully created
 *       400:
 *         description: Kontragent ID is required
 *       404:
 *         description: Kontragent not found
 *       500:
 *         description: Internal server error
 */
router.post("/save/:id", validateUserToken, kontragentAddressController.createOrUpdateKontragentAddress);

/**
 * @swagger
 * /mobile/kontragent-address/delete/{id}:
 *   delete:
 *     summary: Delete a kontragent address (soft delete)
 *     tags: [KontragentAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: KontragentAddress ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: number
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", validateUserToken, kontragentAddressController.deleteKontragentAddress);

export default router;
