import { Router } from "express";
import { updateOrderForAdmin, getAllOrders, getOrderById } from "../../controllers/admin/order";
import { validateAdminToken } from "../../middlewares/adminValidator";

const router = Router();

/**
 * @swagger
 * /orders/update/{id}:
 *   patch:
 *     summary: Admin tomonidan orderni yangilash
 *     description: Admin orderning status, orderType, paymentMethod va boshqa maydonlarini yangilashi mumkin.
 *     tags:
 *       - Admin - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Yangilanadigan orderning ID-si (UUID format)
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
 *                 description: Buyurtma turi (masalan, new, rejected, canceled va h.k.)
 *               status:
 *                 type: string
 *                 example: "pending"
 *                 description: Buyurtma statusi
 *               paymentMethod:
 *                 type: string
 *                 example: "cash"
 *                 description: To'lov usuli
 *               orderPriceStatus:
 *                 type: string
 *                 example: "Оплачен"
 *                 description: Narx to'langan holat (Оплачен / Не оплачен)
 *               deliveryMethod:
 *                 type: string
 *                 example: "pickup"
 *                 description: Yetkazib berish usuli
 *               comment:
 *                 type: string
 *                 example: "Yetkazib berishni tezlashtiring"
 *                 description: Buyurtmaga sharh
 *               city:
 *                 type: string
 *                 example: "Tashkent"
 *                 description: Yetkazib beriladigan shahar
 *               validStartDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-26T04:39:50.736Z"
 *                 description: Buyurtma amal qilish boshlanish vaqti
 *               validEndDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-29T04:39:50.736Z"
 *                 description: Buyurtma amal qilish tugash vaqti
 *               orderDeliveryType:
 *                 type: string
 *                 example: "Комплектуется"
 *                 description: Yetkazib berish turi
 *     responses:
 *       200:
 *         description: Order muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order successfully updated by admin"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 error:
 *                   type: string
 *                   nullable: true
 *                 status:
 *                   type: number
 *                   example: 200
 *       404:
 *         description: Order topilmadi
 *       500:
 *         description: Server xatosi
 */
router.patch("/update/:id", validateAdminToken, updateOrderForAdmin);

/**
 * @swagger
 * /orders/all:
 *   get:
 *     summary: Barcha buyurtmalarni olish
 *     description: Admin buyurtmalarni barchasini olish
 *     tags:
 *       - Admin - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buyurtmalar muvaffaqiyatli olingan
 *         content:
 *           application/json:
 *             schema:  
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'   
 *                 error:
 *                   type: string
 *                   nullable: true
 *                 status:
 *                   type: number
 *                   example: 200   
 *       500:
 *         description: Server xatosi
 */
router.get("/all", validateAdminToken, getAllOrders);

/**
 * @swagger
 * /orders/get-by-id/{id}:
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
router.get('/get-by-id/:id', validateAdminToken, getOrderById)

export default router;
