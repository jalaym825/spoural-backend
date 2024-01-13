import { Router } from 'express';
import controller from './controller';
import { isSportsHead, verifyJWT } from '../../utils/middleware';
const router = Router();

router.get('/:year', controller.getMatches);
router.post('/', verifyJWT, isSportsHead, controller.addMatch);

// export default router;
export default router;