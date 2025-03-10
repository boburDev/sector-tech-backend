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
export default router;
