import express from "express";
import userRouter from "./user";
import productRouter from "./product";
import catalogRouter from "./catalog";
import commentRouter from "./comment";
import questionRouter from "./question";
import cartRouter from "./cart";
import brandRouter from "./brand";

const router = express.Router();

router.use("/auth", userRouter);
router.use("/cart", cartRouter);
router.use("/product", productRouter);
router.use("/catalog", catalogRouter);
router.use("/comment", commentRouter);
router.use("/question", questionRouter);
router.use("/brand", brandRouter)

export default router;
