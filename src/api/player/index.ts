import { Router } from 'express';
import controller from './controller';
const router = Router();

router.get('/:id', controller.getPlayer);

// export default router;
export default router;