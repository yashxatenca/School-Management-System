import { Router } from 'express';
import { homeworkController } from './teacher.homework.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
const router = Router();
router.use(GlobalAuthMiddleware(['teacher']))
router.post('/', homeworkController.create);
router.get('/:id', homeworkController.getHomeworkbyIdsControllers);
router.get('/individual/:id', homeworkController.getById);
router.put('/:id', homeworkController.update);
router.delete('/:id', homeworkController.delete);

export default router;