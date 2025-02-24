import express from "express";
import userRouter from "./user";
import productRouter from "./product";
import catalogRouter from "./catalog";
import commentRouter from "./comment";
import questionRouter from "./question";

const router = express.Router();

router.use("/auth", userRouter);
router.use("/product", productRouter);
router.use("/catalog", catalogRouter);
router.use("/comment", commentRouter);
router.use("/question", questionRouter);

export default router;
