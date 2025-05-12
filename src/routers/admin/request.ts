import { Router } from 'express';
import { getRequests, replyRequest, deleteRequest, getRequestById } from '../../controllers/admin/request';
import { validateAdminToken } from '../../middlewares/adminValidator';
import { uploadPhoto } from '../../middlewares/multer';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: User request management
 */

/**
 * @swagger
 * /request/all:
 *   get:
 *     summary: Get all user requests
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user requests
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/all', validateAdminToken, getRequests);

/**
 * @swagger
 * /request/{id}:
 *   patch:
 *     summary: Add a user reply to the request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *               status:
 *                 type: string
 *               imageRequest:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Request updated with user reply
 *       400:
 *         description: Bad request
 *       404:
 *         description: Request not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', validateAdminToken, uploadPhoto.single("imageRequest"), replyRequest );

/**
 * @swagger
 * /request/{id}:
 *   delete:
 *     summary: Delete a request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', validateAdminToken, deleteRequest);

/**
 * @swagger
 * /request/{id}:
 *   get:
 *     summary: Get a request by ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request data
 *       404:
 *         description: Request not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/:id', validateAdminToken, getRequestById);


export default router;
