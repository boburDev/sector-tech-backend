import { Router } from "express";
import * as Order from "../../controllers/mobile/order";
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
 * /mobile/orders/create:
 *   post:
 *     summary: Foydalanuvchi tomonidan yangi buyurtma yaratish
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 * /mobile/orders/get-all:
 *   get:
 *     summary: Foydalanuvchining barcha buyurtmalari
 *     description: Foydalanuvchining barcha aktiv (rejected bo'lmagan) buyurtmalari yoki so'rov bo'yicha filtrlangan buyurtmalari qaytariladi.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: last
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Agar true yuborilsa, eng oxirgi buyurtma olinadi.
 *       - in: query
 *         name: kontragentName
 *         schema:
 *           type: string
 *         required: false
 *         description: Kontragent nomi bo'yicha qidirish.
 *       - in: query
 *         name: orderPriceStatus
 *         schema:
 *           type: string
 *           enum: [Оплачен, Не оплачен]
 *         required: false
 *         description: Buyurtma to'lov statusi bo'yicha filtrlash.
 *       - in: query
 *         name: orderDeleveryType
 *         schema:
 *           type: string
 *           enum: [Отгружен, Не отгружен]
 *         required: false
 *         description: Buyurtma yetkazib berish statusi bo'yicha filtrlash.
 *       - in: query
 *         name: orderType
 *         schema:
 *           type: string
 *           enum: [new, old, rejected]
 *         required: false
 *         description: Buyurtmaning turini belgilash (masalan, yangi, eski yoki bekor qilingan).
 *       - in: query
 *         name: periodStart
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Qaysi sanadan boshlab (YYYY-MM-DD) filtrlashni boshlash.
 *       - in: query
 *         name: periodEnd
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Qaysi sanagacha (YYYY-MM-DD) filtrlashni yakunlash.
 *       - in: query
 *         name: orderNumber
 *         schema:
 *           type: string
 *         required: false
 *         description: Order raqamiga ko'ra qidirish.
 *     responses:
 *       200:
 *         description: Buyurtmalar muvaffaqiyatli olindi
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
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
 */
router.get("/get-all", validateUserToken, Order.getAllOrders);

/**
 * @swagger
 * /mobile/orders/get-by-id/{id}:
 *   get:
 *     summary: Foydalanuvchining bitta buyurtmasini olish
 *     description: Buyurtma ID-si bo'yicha foydalanuvchining buyurtmasi olinadi.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 * /mobile/orders/cancel/{id}:
 *   patch:
 *     summary: Foydalanuvchining buyurtmasini bekor qilish
 *     description: Foydalanuvchi o'z buyurtmasini bekor qiladi (orderType maydoni "rejected" qilinadi).
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
