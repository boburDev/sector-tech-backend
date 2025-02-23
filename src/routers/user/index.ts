import express from "express";
import userRouter from "./user";
import productRouter from "./product";
import brandsRouter from "./brands";
import productDetailRouter from "./product.detail";
import catalogFilterRouter from "./catalog_filter";
import catalogRouter from "./catalog";

const router = express.Router();

router.use("/auth", userRouter);
router.use("/product", productRouter);
router.use("/brand", brandsRouter);
router.use("/product-detail", productDetailRouter);
router.use("/catalog-filter", catalogFilterRouter);
router.use("/catalog", catalogRouter);

export default router;
