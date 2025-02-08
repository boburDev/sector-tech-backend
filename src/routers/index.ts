import express from 'express'
import adminRouter from "./admin";
import catalogRouter from "./catalog";

const router = express.Router();

router.use('/admin', adminRouter)
router.use('/catalog', catalogRouter)
    
export default router