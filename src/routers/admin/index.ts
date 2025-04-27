import express from 'express'
import adminRouter from "./admin";
import catalogRouter from "./catalog";
import brandsRouter from "./brands";
import catalogFilterRouter from "./catalog_filter";
import productRouter from "./product";
import productDetailRouter from "./product_detail";
import bannerRouter from "./banner"
import promotionRouter from "./promotion"
import changeOrderRouter from "./change-order"
import logsRouter from "./logs"
import garanteeRouter from "./garantee"
import fetchDataRouter from "./fetch_data"
import orderRouter from "./order"
import newsRouter from "./news"
const router = express.Router();

router.use('/admin', adminRouter)
router.use('/catalog', catalogRouter)
router.use('/brand', brandsRouter)
router.use('/catalog-filter', catalogFilterRouter)
router.use('/product-detail', productDetailRouter)
router.use('/product', productRouter)
router.use("/banner", bannerRouter)
router.use("/promotion", promotionRouter)
router.use("/change-order", changeOrderRouter)
router.use("/logs", logsRouter)
router.use("/garantee", garanteeRouter)
router.use("/fetch-data", fetchDataRouter)
router.use("/orders", orderRouter);
router.use("/news", newsRouter);

export default router