import express from "express";
import * as User from "../../controllers/mobile/user";
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
 * /mobile/auth/google/login:
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
router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }),loginAttemptLimiter, User.OAuthCallback);

/**
 * @swagger
 * /mobile/auth/facebook/login:
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

router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }),loginAttemptLimiter, User.OAuthCallback);

/**
 * @swagger
 * /mobile/auth/linkedin/login:
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
router.get("/linkedin/login", passport.authenticate("linkedin", { scope: ["profile", "email"]}));

router.get("/linkedin/callback", passport.authenticate("linkedin", { failureRedirect: "/" }), loginAttemptLimiter, User.OAuthCallback);

/**
 * @swagger
 * /mobile/auth/yandex/login:
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
 * /mobile/auth/login:
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
 * /mobile/auth/send-otp:
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
 * /mobile/auth/sign-up:
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
 *               optCode:
 *                 type: string
 *                 example: 123456
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid data
 */
router.post("/sign-up", loginAttemptLimiter, validate(userSchemaValidator), User.signup);

/**
 * @swagger
 * /mobile/auth/update:
 *   patch:
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
 *       400:
 *         description: Invalid data
 */
router.patch("/update", validateUserToken, User.updateProfile);

/**
 * @swagger
 * /mobile/auth/me:
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

/**
 * @swagger
 * /mobile/auth/update-password:
 *   patch:
 *     summary: Update user password
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
 *               oldPassword:
 *                 type: string 
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid data    
 */
router.patch("/update-password", validateUserToken, User.updateUserPassword);   

// /**
//  * @swagger
//  * /mobile/auth/confirm-email-change:
//  *   post:
//  *     summary: Tasdiqlash kodi yordamida name va emailni yangilash
//  *     tags: [User]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - email
//  *               - otpCode
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: Ali Valiyev
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 example: ali@example.com
//  *               otpCode:
//  *                 type: string
//  *                 example: "123456"
//  *     responses:
//  *       200:
//  *         description: Profil muvaffaqiyatli yangilandi
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Profil muvaffaqiyatli yangilandi
//  *                 token:
//  *                   type: string
//  *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
//  *                 user:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: "abc123"
//  *                     email:
//  *                       type: string
//  *                       example: ali@example.com
//  *                     name:
//  *                       type: string
//  *                       example: Ali Valiyev
//  *       400:
//  *         description: Email yoki OTP noto‘g‘ri
//  *       404:
//  *         description: Foydalanuvchi topilmadi
//  *       401:
//  *         description: Avtorizatsiya qilinmagan
//  */
// router.post("/confirm-email-change", validateUserToken, User.confirmEmailChange);

export default router;
