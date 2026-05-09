import express from 'express';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
import { TeacherHelperController } from './teacher.helper.controller';


const router = express.Router();
router.use(GlobalAuthMiddleware(["teacher"]))
router.get("/", TeacherHelperController.GetClassAndCount)

export default router;