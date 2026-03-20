import { Router } from 'express';
import { AdminAssignClassController } from './admin.assignclass.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';

export class AdminAssignClassRoutes {
    public router: Router;
    private controller: AdminAssignClassController;

    constructor() {
        this.router = Router();
        this.controller = new AdminAssignClassController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Apply auth middleware to the whole router if needed:
        // this.router.use(requireAuth, requireAdmin);

        // CREATE
        this.router.post('/', GlobalAuthMiddleware(['admin']), this.controller.create);

        // READ
        this.router.get('/', GlobalAuthMiddleware(['admin']), this.controller.getAll);
        this.router.get('/:id', GlobalAuthMiddleware(['admin']), this.controller.getById);

        // UPDATE
        this.router.put('/:id', GlobalAuthMiddleware(['admin']), this.controller.update);

        // DELETE
        this.router.delete('/:id', GlobalAuthMiddleware(['admin']), this.controller.delete);
    }
}

export default new AdminAssignClassRoutes().router;