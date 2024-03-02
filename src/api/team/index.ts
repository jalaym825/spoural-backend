import controller from './controller';
import { Router } from 'express';
import { verifyJWT, isSportsHead } from '../../utils/middleware';
const router = Router();

router.get('/year/:year', controller.getTeams);
router.post('/', verifyJWT, isSportsHead, controller.addTeam);
router.get('/team/:id', controller.getTeam);
router.get('/name/:name', controller.getTeamByName);
// return all players applied for selection
router.get('/:id/players', verifyJWT, isSportsHead, controller.getPlayers);
router.put('/player', verifyJWT, controller.addPlayer);
// player is selected in team
router.put('/player/:playerId/select', verifyJWT, isSportsHead, controller.selectPlayer);
router.put('/player/:playerId/remove', verifyJWT, isSportsHead, controller.removePlayer);
router.put('/sendSelectionMail/:teamId', verifyJWT, isSportsHead, controller.sendSelectionMail);
// export default router;
export default router;