import express from 'express'
import adminRouter from "./admin";
import catalogRouter from "./catalog";
import brandsRouter from "./brands";
import catalogFilterRouter from "./catalog_filter";
import userRouter from "./user";
const router = express.Router();

router.use('/admin', adminRouter)
router.use('/user', userRouter)
router.use('/catalog', catalogRouter)
router.use('/brand', brandsRouter)
router.use('/catalog-filter', catalogFilterRouter)

export default router