import express from 'express'
import * as Admin from '../controllers/admin';
import { loginAttemptLimiter } from '../middlewares/attemptLimiter';
import { validateAdminToken } from '../middlewares/adminValidator';

const router = express.Router();

router
    .post('/login', loginAttemptLimiter, Admin.login)
    .post('/create', validateAdminToken, Admin.createAdmin)
    .get('/all', validateAdminToken, Admin.getUsers)
    .get('/by-id/:id', validateAdminToken, Admin.getUserById)
    .put('/update/:id', validateAdminToken, Admin.updateUser)
    .delete('/delete/:id', validateAdminToken, Admin.deleteUser)


export default router
