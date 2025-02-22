import express from "express";
import * as User from "../../controllers/user/user";
import { loginAttemptLimiter } from "../../middlewares/attemptLimiter";
import { validateUserToken } from "../../middlewares/userValidator";
import passport from "passport";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User authentication and profile management
 */
/**
 * @swagger
 * /auth/google/login:
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
router.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  loginAttemptLimiter,
  User.googleCallback
);

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
router.get(
  "/facebook/login",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  loginAttemptLimiter,
  User.googleCallback
);

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
router.get(
  "/linkedin/login",
  passport.authenticate("linkedin", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/" }),
  loginAttemptLimiter,
  User.googleCallback
);

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
router.get(
  "/yandex/login",
  passport.authenticate("yandex", {
    scope: ["login:info", "login:email"],
  })
);

router.get(
  "/yandex/callback",
  passport.authenticate("yandex", { failureRedirect: "/" }),
  loginAttemptLimiter,
  User.googleCallback
);

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
router.post("/sign-up", loginAttemptLimiter, User.signup);

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



// /**
//  * @swagger
//  * /user/auth/all:
//  *   get:
//  *     summary: Get all users
//  *     tags: [User]
//  *     security:
//  *       - BearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved all users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: integer
//  *                   example: 200
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       id:
//  *                         type: string
//  *                         example: "1"
//  *                       name:
//  *                         type: string
//  *                         example: "John Doe"
//  *                       phone:
//  *                         type: string
//  *                         example: "+998901234567"
//  *                       email:
//  *                         type: string
//  *                         example: "john@example.com"
//  *       401:
//  *         description: Unauthorized
//  */
// router.get('/all', validateUserToken, User.getAllUsers);



/**
 * @swagger
 * /user/auth/get/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     phone:
 *                       type: string
 *                       example: "+998901234567"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/get/:id', validateUserToken, User.getUserById);

export default router;
