import { Router } from 'express';
import { MarkController } from './admin.marks.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
import marksModel from '../marks.model';

const router = Router();
const markController = new MarkController();

router.use(GlobalAuthMiddleware(['admin']))

router.post('/', markController.createMark);
router.get('/', markController.getAllMarks);
router.get('/:id', markController.getMarkById);
router.put('/:id', markController.updateMark);
router.get('/mark-class/:id', markController.getDetailByClassId)
router.delete('/:id', markController.deleteMark);

export default router;