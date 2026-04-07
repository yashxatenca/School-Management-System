import express from 'express'
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware'
import { AdminSchoolController } from './admin.school.controller';
const router = express.Router();

router.get("/", GlobalAuthMiddleware(["admin"]), AdminSchoolController.GetSchoolDetail);
router.put("/", GlobalAuthMiddleware(["admin"]), AdminSchoolController.UpdateSchoolProfile);
router.get("/byauthid", GlobalAuthMiddleware(["admin"]), AdminSchoolController.GetSchoolbyauthid);

export default router;