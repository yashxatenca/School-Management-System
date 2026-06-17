import express from "express";
import { getStudentResultController } from "./result.controller";

const router = express.Router();
router.get("/fetch", getStudentResultController);

export default router;
