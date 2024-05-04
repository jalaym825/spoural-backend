import controller from './controller';
import { Router } from 'express';
import ratelimit from 'express-rate-limit';
import multer from 'multer';
import { verifyJWT, isUser, isNotVerified, mailSent } from '../../utils/middleware';
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


const upload = multer({ dest: 'uploads/' });
router.post('/upload',  upload.single('image'), controller.uploadImage);

// export default router;
export default router;