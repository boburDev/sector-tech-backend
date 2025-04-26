import { Router } from "express";
import * as Order from "../../controllers/user/order";
import { validateUserToken } from "../../middlewares/userValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Buyurtmalarni boshqarish (CRUD)
 */

/**
 * @swagger
 * /user/order/create:
 *   post:
 *     summary: Yangi buyurtma yaratish
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverInfo
 *               - productDetails
 *               - orderInfo
 *             properties:
 *               receiverInfo:
 *                 type: object
 *                 required:
 *                   - fullname
 *                   - email
 *                   - phone
 *                 properties:
 *                   fullname:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *               productDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - quantity
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: number
 *               orderInfo:
 *                 type: object
 *                 required:
 *                   - kontragentId
 *                   - agentId
 *                   - city
 *                   - deliveryMethod
 *                   - paymentMethod
 *                   - total
 *                 properties:
 *                   kontragentId:
 *                     type: string
 *                     format: uuid
 *                   agentId:
 *                     type: string
 *                     format: uuid
 *                   city:
 *                     type: string
 *                   comment:
 *                     type: string
 *                   deliveryMethod:
 *                     type: string
 *                     example: "Самовывоз"
 *                   paymentMethod:
 *                     type: string
 *                   total:
 *                     type: number
 *     responses:
 *       201:
 *         description: Buyurtma muvaffaqiyatli yaratildi
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
 *                   type: integer
 *       400:
 *         description: Noto'g'ri ma'lumot
 *       404:
 *         description: Bog'liq resurslar topilmadi
 */
router.post("/create", validateUserToken, Order.createOrder);

/**
 * @swagger
 * /user/order/get-all:
 *   get:
 *     summary: Barcha buyurtmalarni olish
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buyurtmalar ro‘yxati
 */
router.get("/get-all", validateUserToken, Order.getAllOrders);

// /**
//  * @swagger
//  * /user/order/get-by-id/{id}:
//  *   get:
//  *     summary: ID bo‘yicha buyurtmani olish
//  *     tags: [Orders]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       200:
//  *         description: Buyurtma topildi
//  *       404:
//  *         description: Buyurtma topilmadi
//  */
// router.get("/get-by-id/:id", validateUserToken, Order.getOrderById);

// // /**
// //  * @swagger
// //  * /user/order/update/{id}:
// //  *   patch:
// //  *     summary: Buyurtmani yangilash
// //  *     tags: [Orders]
// //  *     security:
// //  *       - bearerAuth: []
// //  *     parameters:
// //  *       - in: path
// //  *         name: id
// //  *         required: true
// //  *         schema:
// //  *           type: string
// //  *           format: uuid
// //  *     requestBody:
// //  *       content:
// //  *         application/json:
// //  *           schema:
// //  *             type: object
// //  *             properties:
// //  *               city:
// //  *                 type: string
// //  *               comment:
// //  *                 type: string
// //  *               status:
// //  *                 type: string
// //  *                 enum: [pending, processing, completed, canceled]
// //  *               products:
// //  *                 type: array
// //  *                 items:
// //  *                   type: string
// //  *                   format: uuid
// //  *     responses:
// //  *       200:
// //  *         description: Buyurtma yangilandi
// //  *       404:
// //  *         description: Buyurtma topilmadi
// //  */
// // router.patch("/update/:id", validateUserToken, Order.updateOrder);

// /**
//  * @swagger
//  * /user/order/delete/{id}:
//  *   delete:
//  *     summary: Buyurtmani o‘chirish
//  *     tags: [Orders]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       200:
//  *         description: Buyurtma soft delete qilindi
//  *       404:
//  *         description: Buyurtma topilmadi
//  */
// router.delete("/delete/:id", validateUserToken, Order.deleteOrder);

export default router;
