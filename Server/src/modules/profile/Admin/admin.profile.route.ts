import { Router } from "express";
import controller from "./admin.profile.controller";
import { GlobalRouteMiddleware } from '../../../core/middleware/global_middleware'

const router = Router();

router.post("/", GlobalRouteMiddleware(["admin"]), controller.create.bind(controller));
router.get("/", GlobalRouteMiddleware(["admin"]), controller.get.bind(controller));
router.put("/", GlobalRouteMiddleware(["admin"]), controller.update.bind(controller));

export default router;
