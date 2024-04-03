import { Router } from 'express';
import controller from './controller';
const router = Router();

router.put('/test/:matchId/:teamId',  controller.getTest);

// router.delete('/delete/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.deleteMatch);
// export default router;
export default router;