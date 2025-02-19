import express from 'express'
import adminRouter from "./admin";
import catalogRouter from "./catalog";
import brandsRouter from "./brands";
import catalogFilterRouter from "./catalog_filter";
import userRouter from "./user";
import productRouter from "./product";
import productDetailRouter from "./product_detail";
const router = express.Router();

router.use('/admin', adminRouter)
router.use('/user', userRouter)
router.use('/catalog', catalogRouter)
router.use('/brand', brandsRouter)
router.use('/catalog-filter', catalogFilterRouter)
router.use('/product-detail', productDetailRouter)
router.use('/product', productRouter)

export default router