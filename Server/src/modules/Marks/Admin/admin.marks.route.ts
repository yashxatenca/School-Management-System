import { Router } from 'express';
import { MarkController } from './admin.marks.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';

const router = Router();
const markController = new MarkController();

router.use(GlobalAuthMiddleware(['admin']))

router.post('/', markController.createMark);
router.get('/', markController.getAllMarks);
router.get('/:id', markController.getMarkById);
router.put('/:id', markController.updateMark);
router.delete('/:id', markController.deleteMark);

export default router;