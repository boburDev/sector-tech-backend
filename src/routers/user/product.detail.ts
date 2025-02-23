import { Router } from 'express';
import * as ProductCondition from '../../controllers/user/product.detail';
import { validateUserToken } from '../../middlewares/userValidator';
import { validate, validateParams } from '../../middlewares/validate';
import { uuidSchema } from '../../validators/admin.validate';
import { productCommentSchema, productIdParamsSchema, productQuestionSchema } from '../../validators/product-comment.validate';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProductCondition
 *   description: Product condition management APIs
 */

/**
 * @swagger
 * /user/product-detail/condition/all:
 *   get:
 *     summary: Get all product conditions
 *     tags: [ProductCondition]
 *     responses:
 *       200:
 *         description: List of product conditions
 */
router.get('/condition/all', ProductCondition.getAllProductConditions)


/**
 * @swagger
 * /user/product-detail/condition/by-id/{id}:
 *   get:
 *     summary: Get product condition by ID
 *     tags: [ProductCondition]
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

router.get('/condition/by-id/:id', validateParams(uuidSchema), ProductCondition.getProductConditionById)


/**
 * @swagger
 * /user/product-detail/condition/by-name/{name}:
 *   get:
 *     summary: Get product conditions by name
 *     tags: [ProductCondition]
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
router.get('/condition/by-name/:name', ProductCondition.getProductConditionByName)



// ///////////////////////////////////////////////////////////////////////////


/**
 * @swagger
 * tags:
 *   name: ProductRelavance
 *   description: Product revalance management APIs
 */


/**
 * @swagger
 * /user/product-detail/relavance/all:
 *   get:
 *     summary: Get all product relevances
 *     tags: [ProductRelavance]
 *     responses:
 *       200:
 *         description: List of all product relevances
 */
router.get('/relavance/all', ProductCondition.getAllProductRelavances)


/**
 * @swagger
 * /user/product-detail/relavance/{id}:
 *   get:
 *     summary: Get a product relevance by ID
 *     tags: [ProductRelavance]
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
router.get('/relavance/:id', validateParams(uuidSchema), ProductCondition.getProductRelavanceById)



/**
 * @swagger
 * /user/product-detail/relavance/by-name/{name}:
 *   get:
 *     summary: Get a product relevance by name
 *     tags: [ProductRelavance]
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

router.get('/relavance/by-name/:name', ProductCondition.getProductRelavanceByName);



// ////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: PopularProduct
 *   description: Popular product management APIs
 */


/**
 * @swagger
 * /user/product-detail/popular/all:
 *   get:
 *     summary: Get all popular products
 *     tags: [PopularProduct]
 *     responses:
 *       200:
 *         description: List of all popular products
 */
router.get('/popular/all',ProductCondition.findAllPopularProducts)



/**
 * @swagger
 * /user/product-detail/popular/{id}:
 *   get:
 *     summary: Get a popular product by ID
 *     tags: [PopularProduct]
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
router.get('/popular/:id', validateParams(uuidSchema), ProductCondition.findOnePopularProduct)




/// ///////////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *   name: productComment
 *   description: Popular product management APIs
 */

/**
 * @swagger
 * /user/product-detail/comment/add:
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
router.post('/comment/add',validateUserToken, validate(productCommentSchema), ProductCondition.addProductComment)




/**
 * @swagger
 * /user/product-detail/comment/all:
 *   get:
 *     summary: Get all product comments
 *     tags: [productComment]
 *     responses:
 *       200:
 *         description: List of product comments
 *       500:
 *         description: Internal server error
 */
router.get("/comment/all",ProductCondition.getAllProductComments);


/**
 * @swagger
 * /user/product-detail/comment/{id}:
 *   get:
 *     summary: Get a product comment by ID
 *     tags: [productComment]
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
router.get("/comment/:id", validateParams(uuidSchema), ProductCondition.getProductCommentById);



/**
 * @swagger
 * /user/product-detail/comment/product/{productId}:
 *   get:
 *     summary: Get comments by product ID
 *     tags: [productComment]
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
router.get("/comment/product/:productId", validateParams(productIdParamsSchema), ProductCondition.getCommentByProductId);


//////////////////////////////////////////////////////////////////


/**
 * @swagger
 * tags:
 *   name: productQuestion
 *   description: Product question management APIs
 */

/**
 * @swagger
 * /user/product-detail/question/add:
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
router.post("/question/add", validateUserToken,validate(productQuestionSchema), ProductCondition.addProductQuestion);



/**
 * @swagger
 * /product-detail/question/all:
 *   get:
 *     summary: Get all product questions
 *     tags: [productQuestion]
 *     responses:
 *       200:
 *         description: List of all product questions
 *       500:
 *         description: Internal server error
 */
router.get("/question/all", ProductCondition.getAllProductQuestions);


/**
 * @swagger
 * /user/product-detail/question/{id}:
 *   get:
 *     summary: Get a product question by ID
 *     tags: [productQuestion]
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
router.get("/question/:id", validateParams(uuidSchema), ProductCondition.getProductQuestionById);




/**
 * @swagger
 * /user/product-detail/question/product/{productId}:
 *   get:
 *     summary: Get questions by product ID
 *     tags: [productQuestion]
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
router.get("/question/product/:productId",validateParams(productIdParamsSchema), ProductCondition.getQuestionByProductId);

export default router;