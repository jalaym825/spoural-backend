import { Router } from 'express';
import controller from './controller';
const router = Router();

router.get('/:id', controller.getPlayer);
router.get('/:playerId/matches/:matchId/battingscore/', controller.getPlayerMatchBattingScore);

// export default router;
export default router;