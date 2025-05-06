import express from "express";
import userRouter from "./user";
import productRouter from "./product";
import catalogRouter from "./catalog";
import commentRouter from "./comment";
import questionRouter from "./question";
import cartRouter from "./cart";
import brandRouter from "./brand";
import bannerRouter from "./banner";
import promotionRouter from "./promotion";
import popularRouter from "./popular";
import regionRouter from "./region";
import kontragentRouter from "./kontragent";
import filterRouter from "./filter";
import kontragentAddressRouter from "./kontragent-addresses";
import orderRouter from "./order";
import newsRouter from "./news";
import requestRouter from "./request";
const router = express.Router();

router.use("/auth", userRouter);
router.use("/cart", cartRouter);
router.use("/product", productRouter);
router.use("/catalog", catalogRouter);
router.use("/comment", commentRouter);
router.use("/question", questionRouter);
router.use("/brand", brandRouter)
router.use("/banner", bannerRouter)
router.use("/promotion", promotionRouter)
router.use("/popular", popularRouter)
router.use("/region", regionRouter) 
router.use("/kontragent", kontragentRouter)
router.use("/filter", filterRouter)
router.use("/kontragent-address", kontragentAddressRouter)
router.use("/orders", orderRouter)
router.use("/news", newsRouter)
router.use("/request", requestRouter)


export default router;
