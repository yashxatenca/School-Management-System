import express from 'express';
import { ExamController } from './admin.exam.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';


const router = express.Router();
router.use(GlobalAuthMiddleware(["admin"]))
router.post('/', ExamController.createExamController);

router.get('/', ExamController.getAllExamController);


router.get('/:id', ExamController.getExamByIdController);

router.put('/:id', ExamController.updateExamController);

router.delete('/:id', ExamController.deleteExamController);

export default router;