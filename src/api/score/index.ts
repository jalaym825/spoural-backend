import { Router } from 'express';
import controller from './controller';
import { isMatchPlayed, isValidMatch } from '../../utils/middleware';
const router = Router();

router.get('/:matchId', isValidMatch, isMatchPlayed, controller.getScore);
router.post('/:matchId', isValidMatch, isMatchPlayed, controller.updateScore);
// export default router;
export default router;