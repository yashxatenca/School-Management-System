import { Router } from "express";
import controller from "./teacher.profile.controller";
import { GlobalRouteMiddleware } from "../../../core/middleware/global_middleware";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();

router.post(
  "/",
  GlobalRouteMiddleware(["teacher"]),
  controller.create.bind(controller),
);
router.get(
  "/get-profile",
  GlobalRouteMiddleware(["teacher"]),
  controller.get.bind(controller),
);
router.put(
  "/",
  GlobalRouteMiddleware(["teacher"]),
  controller.update.bind(controller),
);
router.get(
  "/student/:id",
  GlobalAuthMiddleware(["teacher"]),
  controller.getStudentProfile.bind(controller),
);
export default router;
