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
 * /user/orders/create:
 *   post:
 *     summary: Foydalanuvchi tomonidan yangi buyurtma yaratish
 *     description: Foydalanuvchi mahsulot va kafolatlar bilan buyurtma yaratadi.
 *     tags:
 *       - User - Orders
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverInfo:
 *                 type: object
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
 *                   properties:
 *                     productId:
 *                       type: string
 *                     count:
 *                       type: integer
 *                     garanteeId:
 *                       type: string
 *               orderInfo:
 *                 type: object
 *                 properties:
 *                   deliveryMethod:
 *                     type: string
 *                   kontragentId:
 *                     type: string
 *                   agentId:
 *                     type: string
 *                   city:
 *                     type: string
 *                   comment:
 *                     type: string
 *                   paymentMethod:
 *                     type: string
 *     responses:
 *       201:
 *         description: Buyurtma muvaffaqiyatli yaratildi
 */
router.post("/create", validateUserToken, Order.createOrder);

/**
 * @swagger
 * /user/orders/get-all:
 *   get:
 *     summary: Foydalanuvchining barcha buyurtmalari
 *     description: Foydalanuvchining barcha aktiv (rejected bo'lmagan) buyurtmalari qaytariladi.
 *     tags:
 *       - User - Orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Buyurtmalar muvaffaqiyatli olindi
 */
router.get("/get-all", validateUserToken, Order.getAllOrders);
    
/**
 * @swagger
 * /user/orders/get-by-id/{id}:
 *   get:
 *     summary: Foydalanuvchining bitta buyurtmasini olish
 *     description: Buyurtma ID-si bo'yicha foydalanuvchining buyurtmasi olinadi.
 *     tags:
 *       - User - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Buyurtma ID-si
 *     responses:
 *       200:
 *         description: Buyurtma muvaffaqiyatli olindi
 *       404:
 *         description: Buyurtma topilmadi
 */
router.get("/get-by-id/:id", validateUserToken, Order.getOrderById);

/**
 * @swagger
 * /user/orders/cancel/{id}:
 *   patch:
 *     summary: Foydalanuvchining buyurtmasini bekor qilish
 *     description: Foydalanuvchi o'z buyurtmasini bekor qiladi (orderType maydoni "rejected" qilinadi).
 *     tags:
 *       - User - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Buyurtma ID-si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderType:
 *                 type: string
 *                 example: "rejected"
 *     responses:
 *       200:
 *         description: Buyurtma bekor qilindi
 *       404:
 *         description: Buyurtma topilmadi
 */
router.patch("/cancel/:id", validateUserToken, Order.cancelOrder);

export default router;
