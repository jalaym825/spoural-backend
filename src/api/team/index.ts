import { Router } from 'express';
import { isSportsHead, verifyJWT } from '../../utils/middleware';
import controller from './controller';
const router = Router();

router.get('/year/:year', controller.getTeams);
router.post('/', verifyJWT, isSportsHead, controller.addTeam);

// get team data
router.get('/team/:id', controller.getTeam);

// get team data by name
router.get('/name/:name', controller.getTeamByName);

// return all players applied for selection
router.get('/:id/players', controller.getPlayers);

// get playing xi players
router.get('/:id/playingxi', controller.getPlayingXI);

// add player to team
router.put('/player', verifyJWT, controller.addPlayer);

// player is selected in team
router.put('/player/:playerId/select', verifyJWT, isSportsHead, controller.selectPlayer);

// player is removed from team
router.put('/player/:playerId/remove', verifyJWT, isSportsHead, controller.removePlayer);

// send selection mail to all selected players
router.put('/sendSelectionMail/:teamId', verifyJWT, isSportsHead, controller.sendSelectionMail);

router.get('/:teamId/scorecard/:matchId', controller.getScoreCard);

router.get('/:teamId/battersscore/:matchId', controller.getBattingScore);
router.get('/:teamId/bowlersscore/:matchId', controller.getBowlingScore);

// export default router;
export default router;