import { Router } from 'express';
import ratelimit from 'express-rate-limit';
import { isNotVerified, isUser, mailSent, verifyJWT } from '../../utils/middleware';
import controller from './controller';

const router = Router();

const verificationMailLimiter = ratelimit({
    windowMs: 3.6e+6, // 1 hour
    max: 5, // 5 requests per hour
    message: {
        error: "Too many requests, please try again later.",
    }
});
router.put('/verify/:token', controller.verify);
router.post('/sendVerificationMail', isUser, isNotVerified, mailSent, verificationMailLimiter, controller.sendVerificationMail);
router.post("/register", controller.register);
router.post('/login', controller.login);
// router.post('/refreshAccessToken', controller.refreshAccessToken);
router.put('/logout', verifyJWT, controller.logout);
router.get('/me', verifyJWT, controller.getUser);

router.post('/upload', verifyJWT, controller.uploadImage);

// export default router;
export default router;