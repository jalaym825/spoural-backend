import controller from './controller';
import { Router } from 'express';
import { verifyJWT, isSportsHead } from './middleware';
const router = Router();

router.get('/year/:year', controller.getTeams);
router.post('/', verifyJWT, isSportsHead, controller.addTeam);
router.get('/team/:id', controller.getTeam);
router.get('/name/:name', controller.getTeamByName);
router.get('/:id/players', controller.getPlayers);
router.put('/player', verifyJWT, controller.addPlayer);

// export default router;
export default router;