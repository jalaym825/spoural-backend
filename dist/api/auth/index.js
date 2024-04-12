"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("./controller"));
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
const verificationMailLimiter = (0, express_rate_limit_1.default)({
    windowMs: 3.6e+6, // 1 hour
    max: 5, // 5 requests per hour
    message: {
        error: "Too many requests, please try again later.",
    }
});
router.put('/verify/:token', controller_1.default.verify);
router.post('/sendVerificationMail', middleware_1.isUser, middleware_1.isNotVerified, middleware_1.mailSent, verificationMailLimiter, controller_1.default.sendVerificationMail);
router.post("/register", controller_1.default.register);
router.post('/login', controller_1.default.login);
// router.post('/refreshAccessToken', controller.refreshAccessToken);
router.put('/logout', middleware_1.verifyJWT, controller_1.default.logout);
router.get('/me', middleware_1.verifyJWT, controller_1.default.getUser);
// export default router;
exports.default = router;
//# sourceMappingURL=index.js.map