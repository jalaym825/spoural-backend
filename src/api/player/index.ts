import { Router } from 'express';
import controller from './controller';
import { isSportsHead, verifyJWT } from '../../utils/middleware';
const router = Router();

router.get('/:id', controller.getPlayer);
router.post('/:userId', verifyJWT, isSportsHead, controller.addPlayer);

// export default router;
export default router;