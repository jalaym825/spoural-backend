import { Router } from 'express';
import controller from './controller';
import { isSportsHead, verifyJWT } from '../../utils/middleware';
const router = Router();

router.get('/', verifyJWT, isSportsHead, controller.getTickets);
router.get('/:ticketId', verifyJWT, isSportsHead, controller.getTicket);
router.post('/', controller.createTicket);
router.post('/reply/:ticketId', verifyJWT, isSportsHead, controller.reply)

export default router;