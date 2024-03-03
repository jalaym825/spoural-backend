import { Router } from 'express';
import controller from './controller';
import { isSportsHead, verifyJWT } from '../../utils/middleware';
const router = Router();

router.get('/', verifyJWT, isSportsHead, controller.getTickets);
router.get('/:ticketId', verifyJWT, isSportsHead, controller.getTicket);
router.post('/', verifyJWT, controller.createTicket);

export default router;