import { Router } from 'express';
import { homeworkController } from './admin.homework.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
const router = Router();

router.post('/', GlobalAuthMiddleware(['admin']), homeworkController.create);
router.get('/:id', GlobalAuthMiddleware(['admin']), homeworkController.getHomeworkbyIdsControllers);
router.get('/individual/:id', GlobalAuthMiddleware(['admin']), homeworkController.getById);
router.put('/:id', GlobalAuthMiddleware(['admin']), homeworkController.update);
router.delete('/:id', GlobalAuthMiddleware(['admin']), homeworkController.delete);

export default router;