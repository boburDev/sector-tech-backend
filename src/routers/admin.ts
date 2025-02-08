import express from 'express'
import * as Admin from '../controllers/admin';
import { loginAttemptLimiter } from '../middlewares/attemptLimiter';
import { validateAdminToken } from '../middlewares/adminValidator';

const router = express.Router();

router
    .post('/login', loginAttemptLimiter, Admin.login)
    .post('/create', validateAdminToken, Admin.createAdmin)

export default router
