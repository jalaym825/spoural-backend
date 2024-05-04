import { Router } from 'express';
import { isSportsHead, isValidMatch, verifyJWT } from '../../utils/middleware';
import controller from './controller';
const router = Router();

router.get('/year/:year', controller.getMatches);
router.get('/:matchId', controller.getMatch);
router.get('/overs/:overId', controller.getOver);

router.post('/', verifyJWT, isSportsHead, controller.addMatch);
router.put('/:matchId/start', verifyJWT, isSportsHead, isValidMatch, controller.startMatch);
router.put('/:matchId/toss', verifyJWT, isSportsHead, isValidMatch, controller.updateMatchToss);

router.put('/runs/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.updateRuns);
router.put('/wicket/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.updateWickets);
router.put('/bowler/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.updateBowler);
router.post('/over/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.createOver);

router.put('/:matchId/startSecondInning', verifyJWT, isSportsHead, isValidMatch, controller.startSecondInning);

router.put('/:matchId/deleteLastBall', verifyJWT, isSportsHead, isValidMatch, controller.deleteLastBall);

// router.delete('/delete/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.deleteMatch);
// export default router;
export default router;