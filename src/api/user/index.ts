import { Router } from 'express';
import controller from './controller';
const router = Router();

router.get('/:userId', controller.getUser);
router.get('/rollno/:rollNo', controller.getUserByRollNo);

// export default router;
export default router;