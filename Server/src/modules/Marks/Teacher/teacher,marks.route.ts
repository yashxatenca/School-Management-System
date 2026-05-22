import express from "express";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = express.Router();

router.use(GlobalAuthMiddleware(["teacher"]));
export default router;
