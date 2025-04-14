import express from "express";
import * as kontragentAddressController from "../../controllers/mobile/kontragent";
import { validateUserToken } from "../../middlewares/userValidator";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: KontragentAddresses
 *   description: Kontragent address management
 */

/**
 * @swagger
 * /mobile/kontragent-address/create/{kontragentId}:
 *   post:
 *     summary: Create a new kontragent address
 *     tags: [KontragentAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: kontragentId
 *         in: path
 *         required: true
 *         description: The ID of the kontragent
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             required:
 *               - fullAddress
 *               - country
 *               - region
 *               - district
 *               - street
 *               - house
 *               - index
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
 *               fullAddress: "Tashkent, Chilonzor, 10-uy"
 *               country: "UZ"
 *               region: "Tashkent"
 *               district: "Chilonzor"
 *               street: "Bog'ishamol"
 *               house: "10"
 *               apartment: "5"
 *               index: "100115"
 *               comment: "Main office"
 *               isMain: true
 *     responses:
 *       201:
 *         description: Kontragent address successfully created
 *       404:
 *         description: Kontragent not found
 *       500:
 *         description: Server error
 */
router.post("/create/:kontragentId", validateUserToken, kontragentAddressController.createKontragentAddress);

/**
 * @swagger
 * /mobile/kontragent-address/update/{id}:
 *   patch:
 *     summary: Update an existing kontragent address
 *     tags: [KontragentAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the kontragent address
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
 *               fullAddress: "Tashkent, Yunusabad, Amir Temur 5"
 *               country: "UZ"
 *               region: "Tashkent"
 *               district: "Yunusabad"
 *               street: "Amir Temur"
 *               house: "5"
 *               apartment: "12"
 *               index: "100120"
 *               comment: "Updated address"
 *               isMain: false
 *     responses:
 *       200:
 *         description: Kontragent address successfully updated
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.patch("/update/:id", validateUserToken, kontragentAddressController.updateKontragentAddress);

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
