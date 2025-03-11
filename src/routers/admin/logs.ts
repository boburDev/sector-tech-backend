import express from "express";
import * as logs from "../../controllers/admin/logs";

const router = express.Router();

router.get("/all", logs.getAllLogs);
router.get("/:id", logs.getLogById);
router.put("/update/:id", logs.resolveLog);
router.delete("/delete/:id", logs.deleteLog);

export default router;
