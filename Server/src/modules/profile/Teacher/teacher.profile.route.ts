import { Router } from "express";
import controller from "./teacher.profile.controller";
import { GlobalRouteMiddleware } from '../../../core/middleware/global_middleware'

const router = Router();

router.post("/", GlobalRouteMiddleware(["teacher", "admin"]), controller.create.bind(controller));
router.get("/", GlobalRouteMiddleware(["teacher","admin"]), controller.get.bind(controller));
router.put("/", GlobalRouteMiddleware(["teacher", "admin"]), controller.update.bind(controller));

export default router;