import controller from './controller';
import { Router } from 'express';
import { verifyJWT, isSportsHead } from './middleware';
const router = Router();

router.get('/', controller.getTeams);
router.post('/', verifyJWT, isSportsHead, controller.addTeam);
router.get('/:id', controller.getTeam);
router.post('/player', verifyJWT, isSportsHead, controller.addPlayer);

// export default router;
export default router;