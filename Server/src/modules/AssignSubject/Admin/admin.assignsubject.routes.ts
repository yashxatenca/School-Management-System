import { Router } from 'express';
import { AdminAssignSubjectController } from './admin.assignsubject.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
class AdminAssignSubjectRoutes {
    public router: Router;
    private controller: AdminAssignSubjectController;

    constructor() {
        this.router = Router();
        this.controller = new AdminAssignSubjectController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', GlobalAuthMiddleware(['admin']), this.controller.create);
        this.router.get('/', GlobalAuthMiddleware(['admin']), this.controller.getAll);
        this.router.delete('/:id', GlobalAuthMiddleware(['admin']), this.controller.delete);
    }
}

export const assignsubjectroute = new AdminAssignSubjectRoutes().router;