import express from 'express'
import * as User from '../../controllers/user';
import { loginAttemptLimiter } from '../../middlewares/attemptLimiter';
import { validateUserToken } from '../../middlewares/userValidator';

const router = express.Router();

router
    .post('/login', loginAttemptLimiter, User.login)
    .post('/create', loginAttemptLimiter, User.signup)
    .put('/update', validateUserToken, User.updateProfile)


export default router
