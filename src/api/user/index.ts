import { Router } from 'express';
import controller from './controller';
const router = Router();

router.get('/:userId', controller.getUser);

// export default router;
export default router;