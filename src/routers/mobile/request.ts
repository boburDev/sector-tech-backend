import { Router } from 'express';
import { createRequest, getRequests, getRequestById, updateRequest, deleteRequest } from '../../controllers/mobile/requests';
import { validateUserToken } from '../../middlewares/userValidator';
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
 * /mobile/request/create:
 *   post:
 *     summary: Create a new user request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - topicCategory
 *               - topic
 *               - fullName
 *               - email
 *               - description
 *             properties:
 *               topicCategory:
 *                 type: string
 *               topic:
 *                 type: string
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               orderNumber:
 *                 type: string
 *               description:
 *                 type: string
 *               imageRequest:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Request created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/create', validateUserToken, uploadPhoto.single("imageRequest"), createRequest );

/**
 * @swagger
 * /mobile/request/all:
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
router.get('/all', validateUserToken, getRequests);

/**
 * @swagger
 * /mobile/request/{id}:
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
router.get('/:id', validateUserToken, getRequestById);

/**
 * @swagger
 * /mobile/request/{id}:
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
router.patch('/:id', validateUserToken, uploadPhoto.single("imageRequest"), updateRequest );

/**
 * @swagger
 * /mobile/request/{id}:
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
router.delete('/:id', validateUserToken, deleteRequest);

export default router;
