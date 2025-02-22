import { Router } from 'express';
import * as ProductCondition from '../../controllers/admin/product_details';
import { validateAdminToken } from '../../middlewares/adminValidator';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProductCondition
 *   description: Product condition management APIs
 */

/**
 * @swagger
 * /product-detail/condition/all:
 *   get:
 *     summary: Get all product conditions
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of product conditions
 */
router.get('/condition/all', validateAdminToken, ProductCondition.getAllProductConditions)


/**
 * @swagger
 * /product-detail/condition/by-id/{id}:
 *   get:
 *     summary: Get product condition by ID
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product condition ID
 *     responses:
 *       200:
 *         description: Product condition details
 */

router.get('/condition/by-id/:id', validateAdminToken, ProductCondition.getProductConditionById)


/**
 * @swagger
 * /product-detail/condition/by-name/{name}:
 *   get:
 *     summary: Get product conditions by name
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product condition names (comma-separated)
 *     responses:
 *       200:
 *         description: List of product conditions
 */
router.get('/condition/by-name/:name', validateAdminToken, ProductCondition.getProductConditionByName)

/**
 * @swagger
 * /product-detail/condition/create:
 *   post:
 *     summary: Create a product condition
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product condition created successfully
 */
router.post('/condition/create', validateAdminToken, ProductCondition.createProductCondition)


/**
 * @swagger
 * /product-detail/condition/update/{id}:
 *   put:
 *     summary: Update a product condition
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product condition ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product condition updated successfully
 */
router.put('/condition/update/:id', validateAdminToken, ProductCondition.updateProductCondition)


/**
 * @swagger
 * /product-detail/condition/delete/{id}:
 *   delete:
 *     summary: Delete a product condition
 *     tags: [ProductCondition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product condition ID
 *     responses:
 *       200:
 *         description: Product condition deleted successfully
 */
router.delete('/condition/delete/:id', validateAdminToken, ProductCondition.deleteProductCondition)
 

// ///////////////////////////////////////////////////////////////////////////


/**
 * @swagger
 * tags:
 *   name: ProductRelavance
 *   description: Product revalance management APIs
 */


/**
 * @swagger
 * /product-detail/relavance/all:
 *   get:
 *     summary: Get all product relevances
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all product relevances
 */
router.get('/relavance/all', validateAdminToken, ProductCondition.getAllProductRelavances)


/**
 * @swagger
 * /product-detail/relavance/{id}:
 *   get:
 *     summary: Get a product relevance by ID
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product relevance ID
 *     responses:
 *       200:
 *         description: Product relevance details
 */
router.get('/relavance/:id', validateAdminToken, ProductCondition.getProductRelavanceById)


/**
 * @swagger
 * /product-detail/relavance/create:
 *   post:
 *     summary: Create a new product relevance
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product relevance created
 */
router.post('/relavance/create', validateAdminToken, ProductCondition.createProductRelavance)
/**
 * @swagger
 * /product-detail/relavance/by-name/{name}:
 *   get:
 *     summary: Get a product relevance by name
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product relevance name
 *     responses:
 *       200:
 *         description: Product relevance details
 *       404:
 *         description: Product relevance not found
 */

router.get('/relavance/by-name/:name', validateAdminToken, ProductCondition.getProductRelavanceByName);


/**
 * @swagger
 * /product-detail/relavance/update/{id}:
 *   put:
 *     summary: Update a product relevance
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product relevance ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product relevance updated
 */
router.put('/relavance/update/:id', validateAdminToken, ProductCondition.updateProductRelavance)


/**
 * @swagger
 * /product-detail/relavance/delete/{id}:
 *   delete:
 *     summary: Delete a product relevance
 *     tags: [ProductRelavance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product relevance ID
 *     responses:
 *       200:
 *         description: Product relevance deleted
 */
router.delete('/relavance/delete/:id', validateAdminToken, ProductCondition.deleteProductRelavance);



// ////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: PopularProduct
 *   description: Popular product management APIs
 */

/**
 * @swagger
 * /product-detail/popular/create:
 *   post:
 *     summary: Create a new popular product
 *     tags: [PopularProduct]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Popular product created successfully
 *       404:
 *         description: Product not found
 */
router.post('/popular/add',validateAdminToken,ProductCondition.addToPopularProduct)


/**
 * @swagger
 * /product-detail/popular/all:
 *   get:
 *     summary: Get all popular products
 *     tags: [PopularProduct]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all popular products
 */
router.get('/popular/all',validateAdminToken,ProductCondition.findAllPopularProducts)



/**
 * @swagger
 * /product-detail/popular/{id}:
 *   get:
 *     summary: Get a popular product by ID
 *     tags: [PopularProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Popular product ID
 *     responses:
 *       200:
 *         description: Popular product details
 *       404:
 *         description: Popular product not found
 */
router.get('/popular/:id',validateAdminToken,ProductCondition.findOnePopularProduct)


/**
 * @swagger
 * /product-detail/popular/update/{id}:
 *   put:
 *     summary: Update a popular product
 *     tags: [PopularProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Popular product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Popular product updated successfully
 *       404:
 *         description: Popular product not found
 */
router.put('/popular/update/:id',validateAdminToken,ProductCondition.updatePopularProduct)

/**
 * @swagger
 * /product-detail/popular/delete/{id}:
 *   delete:
 *     summary: Delete a popular product
 *     tags: [PopularProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Popular product ID
 *     responses:
 *       200:
 *         description: Popular product deleted successfully
 *       404:
 *         description: Popular product not found
 */
router.delete('/popular/delete/:id',validateAdminToken,ProductCondition.deletePopularProduct)



/// ///////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: productComment
 *   description: Popular product management APIs
 */

/**
 * @swagger
 * /product-detail/comment/add:
 *   post:
 *     summary: Add a new product comment
 *     tags: [productComment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentBody:
 *                 type: string
 *                 example: "Great product!"
 *               star:
 *                 type: integer
 *                 example: 5
 *               productId:
 *                 type: string
 *                 example: "product-uuid"
 *               userId:
 *                 type: string
 *                 example: "user-uuid"
 *     responses:
 *       201:
 *         description: Product comment created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/comment/add',validateAdminToken,ProductCondition.addProductComment)

/**
 * @swagger
 * /product-detail/comment/reply:
 *   post:
 *     summary: Add a reply to a product comment
 *     tags: [productComment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 example: "comment-uuid"
 *               adminId:
 *                 type: string
 *                 example: "admin-uuid"
 *               message:
 *                 type: string
 *                 example: "Thank you for your feedback!"
 *     responses:
 *       200:
 *         description: Reply added successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.post("/comment/reply", validateAdminToken,ProductCondition.addReplyToComment);

/**
 * @swagger
 * /product-detail/comment/all:
 *   get:
 *     summary: Get all product comments
 *     tags: [productComment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of product comments
 *       500:
 *         description: Internal server error
 */
router.get("/comment/all", validateAdminToken,ProductCondition.getAllProductComments);


/**
 * @swagger
 * /product-detail/comment/{id}:
 *   get:
 *     summary: Get a product comment by ID
 *     tags: [productComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product Comment ID
 *     responses:
 *       200:
 *         description: Product comment data
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.get("/comment/:id", validateAdminToken,ProductCondition.getProductCommentById);

/**
 * @swagger
 * /product-detail/comments/{id}:
 *   delete:
 *     summary: Delete a product comment
 *     tags: [productComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete("/comments/:id", validateAdminToken,ProductCondition.deleteProductComment);

/**
 * @swagger
 * /product-detail/comment/product/{productId}:
 *   get:
 *     summary: Get comments by product ID
 *     tags: [productComment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of comments for the product
 *       404:
 *         description: No comments found for this product
 *       500:
 *         description: Internal server error
 */
router.get("/comment/product/:productId", validateAdminToken,ProductCondition.getCommentByProductId);


//////////////////////////////////////////////////////////////////


/**
 * @swagger
 * tags:
 *   name: productQuestion
 *   description: Product question management APIs
 */

/**
 * @swagger
 * /product-detail/question/add:
 *   post:
 *     summary: Add a new product question
 *     tags: [productQuestion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 example: "Is this product suitable for outdoor use?"
 *               productId:
 *                 type: string
 *                 example: "product-uuid"
 *               userId:
 *                 type: string
 *                 example: "user-uuid"
 *     responses:
 *       201:
 *         description: Product question created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/question/add", validateAdminToken, ProductCondition.addProductQuestion);


/**
 * @swagger
 * /product-detail/question/reply:
 *   post:
 *     summary: Add a reply to a product question
 *     tags: [productQuestion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 example: "question-uuid"
 *               adminId:
 *                 type: string
 *                 example: "admin-uuid"
 *               message:
 *                 type: string
 *                 example: "Yes, it is suitable for outdoor use."
 *     responses:
 *       200:
 *         description: Reply added successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
router.post("/question/reply", validateAdminToken, ProductCondition.addReplyToQuestion);


/**
 * @swagger
 * /product-detail/question/all:
 *   get:
 *     summary: Get all product questions
 *     tags: [productQuestion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all product questions
 *       500:
 *         description: Internal server error
 */
router.get("/question/all", validateAdminToken, ProductCondition.getAllProductQuestions);


/**
 * @swagger
 * /product-detail/question/{id}:
 *   get:
 *     summary: Get a product question by ID
 *     tags: [productQuestion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product question ID
 *         example: "question-uuid"
 *     responses:
 *       200:
 *         description: Product question details
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
router.get("/question/:id", validateAdminToken, ProductCondition.getProductQuestionById);


/**
 * @swagger
 * /product-detail/question/{id}:
 *   delete:
 *     summary: Delete a product question
 *     tags: [productQuestion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product question ID
 *         example: "question-uuid"
 *     responses:
 *       200:
 *         description: Product question deleted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
router.delete("/question/:id", validateAdminToken, ProductCondition.deleteProductQuestion);


/**
 * @swagger
 * /product-detail/question/product/{productId}:
 *   get:
 *     summary: Get questions by product ID
 *     tags: [productQuestion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *         example: "product-uuid"
 *     responses:
 *       200:
 *         description: List of questions for the product
 *       500:
 *         description: Internal server error
 */
router.get("/question/product/:productId", validateAdminToken, ProductCondition.getQuestionByProductId);

export default router;