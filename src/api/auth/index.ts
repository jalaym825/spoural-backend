import controller from './controller';
import { Router } from 'express';
import ratelimit from 'express-rate-limit';
import { verifyJWT, isUser, isNotVerified, mailSent } from '../../utils/middleware';
const router = Router();

const verificationMailLimiter = ratelimit({
    windowMs: 3.6e+6, // 1 hour
    max: 5, // 5 requests per hour
    message: {
        data: {
            error: "Too many requests, please try again later.",
        }
    }
});
router.get('/verify/:token', controller.verify);
router.post('/sendVerificationMail', isUser, isNotVerified, mailSent, verificationMailLimiter, controller.sendVerificationMail);
router.post("/register", controller.register);
router.post('/login', controller.login);
router.post('/refreshAccessToken', controller.refreshAccessToken);
router.post('/logout', verifyJWT, controller.logout);

// export default router;
export default router;