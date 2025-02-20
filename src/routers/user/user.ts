import express, { Request, Response } from "express";
import * as User from "../../controllers/user";
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
 * /auth/facebook/login:
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
 * /auth/linkedin/login:
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
 * /auth/yandex/login:
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
 * /auth/login:
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
 * /auth/sign-up:
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
 * /auth/update:
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

export default router;
