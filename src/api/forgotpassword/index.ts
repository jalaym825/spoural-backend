import controller from './controller'
import { Router } from 'express'
const router = Router();

router.post('/resetPassword', controller.resetPassword);
router.post('/verify',controller.verify);
router.post('/changePassword',controller.changePassword);

export default router;