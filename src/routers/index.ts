import express from 'express'
import adminRouter from "./admin";
import catalogRouter from "./catalog";
import brandsRouter from "./brands";
const router = express.Router();


router.use('/admin', adminRouter)
router.use('/catalog', catalogRouter)
router.use('/brand', brandsRouter)

export default router