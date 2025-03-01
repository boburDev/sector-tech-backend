import { Router } from "express";
import * as ChangeOrder from "../../controllers/admin/change-order";
import { validateAdminToken } from "../../middlewares/adminValidator";
import { validate, validateQuery } from "../../middlewares/validate";
import { changeOrderBodySchema, changeOrderQuerySchema } from "../../validators/change-order";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ChangeOrder
 *   description: Change order management APIs
 */
/**
 * @swagger
 * /change-order/update:
 *   patch: 
 *     summary: Change order of a specific entity
 *     tags: [ChangeOrder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the entity to change order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               index:
 *                 type: number   
 *     responses:
 *       200:
 *         description: The order of the entity has been changed successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.patch('/update', validateAdminToken, validateQuery(changeOrderQuerySchema), validate(changeOrderBodySchema), ChangeOrder.changeOrder);

export default router;
