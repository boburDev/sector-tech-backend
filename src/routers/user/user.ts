import express from "express";
import * as User from "../../controllers/user/user";
import { loginAttemptLimiter } from "../../middlewares/attemptLimiter";
import { validateUserToken } from "../../middlewares/userValidator";
import passport from "passport";
import { userSchemaValidator } from "../../validators/user.validator";
import { validate } from "../../middlewares/validate";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /user/auth/google/login:
 *   get:
 *     summary: Login and sign-up with Google
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully created or logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 */
router.get("/google/login",passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/" }),loginAttemptLimiter, User.OAuthCallback);

/**
 * @swagger
 * /user/auth/facebook/login:
 *   get:
 *     summary: Login and sign-up with Facebook
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully created or logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 */
router.get( "/facebook/login", passport.authenticate("facebook", {   scope: ["email", "public_profile"] }));

router.get("/facebook/callback",passport.authenticate("facebook", { failureRedirect: "/" }),loginAttemptLimiter, User.OAuthCallback);

/**
 * @swagger
 * /user/auth/linkedin/login:
 *   get:
 *     summary: Login and sign-up with LinkedIn
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully created or logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 */
router.get("/linkedin/login",passport.authenticate("linkedin", { scope: ["profile", "email"]}));

router.get("/linkedin/callback",passport.authenticate("linkedin", { failureRedirect: "/" }), loginAttemptLimiter, User.OAuthCallback);

/**
 * @swagger
 * /user/auth/yandex/login:
 *   get:
 *     summary: Login and sign-up with Yandex
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully created or logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 */
router.get("/yandex/login",passport.authenticate("yandex", { scope: ["login:info", "login:email"]}));

router.get("/yandex/callback",passport.authenticate("yandex", { failureRedirect: "/" }), loginAttemptLimiter, User.OAuthCallback);

/**
 * @swagger
 * /user/auth/login:
 *   post:
 *     summary: User login with values
 *     tags: [User]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecret123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginAttemptLimiter, User.login);

/**
 * @swagger
 * /user/auth/send-otp:
 *   post:
 *     summary: Send OTP to user's email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       500:
 *         description: Error sending OTP
 */
router.post("/send-otp", User.sendOtp);

/**
 * @swagger
 * /user/auth/sign-up:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecurePassword
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid data
 */
router.post("/sign-up", loginAttemptLimiter, validate(userSchemaValidator), User.signup);

/**
 * @swagger
 * /user/auth/update:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/update", validateUserToken, User.updateProfile);

/**
 * @swagger
 * /user/auth/me:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "a1b2c3d4"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 status:
 *                   type: number
 *                   example: 200
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/me', validateUserToken, User.getUserById);

export default router;
