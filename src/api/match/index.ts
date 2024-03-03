import { Router } from 'express';
import controller from './controller';
import { isSportsHead, isValidMatch, verifyJWT } from '../../utils/middleware';
const router = Router();

router.get('/year/:year', controller.getMatches);
router.get('/:matchId', controller.getMatch);
router.post('/', verifyJWT, isSportsHead, controller.addMatch);
router.put('/start/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.startMatch);
router.put('/toss/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.updateMatchToss);
// router.delete('/delete/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.deleteMatch);
// export default router;
export default router;