"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMatchPlayed = exports.isValidMatch = exports.mailSent = exports.isNotVerified = exports.isUser = exports.isSportsHead = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("./logger"));
const prisma_1 = __importDefault(require("./prisma"));
const heplers_1 = require("./heplers");
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (!token) {
        logger_1.default.warn(`[/middleware/verifyJWT] - token missing`);
        logger_1.default.debug(`[/middleware/verifyJWT] - token: ${token}`);
        return res.status(401).json({
            error: 'No token provided.'
        });
    }
    try {
        const payload = yield jsonwebtoken_1.default.verify(token.toString(), process.env.JWT_SECRET);
        const user = yield prisma_1.default.users.findUnique({
            where: {
                userId: payload.userId
            }
        });
        if (!user) {
            logger_1.default.warn(`[/middleware/verifyJWT] - user not found`);
            return res.status(401).json({
                error: 'Invalid access token.'
            });
        }
        logger_1.default.info(`[/middleware/verifyJWT] - user: ${user === null || user === void 0 ? void 0 : user.userId} authenticated`);
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.default.error(`[/middleware/verifyJWT] - ${error.message}`);
        return res.status(500).json({
            error: 'Failed to authenticate token.'
        });
    }
});
exports.verifyJWT = verifyJWT;
const isSportsHead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.debug(`[/middleware/isSportsHead] - user: ${req.user.userId}, role: ${req.user.role}`);
        if (!req.user.roles.includes('SPORTS_HEAD')) {
            logger_1.default.warn(`[/middleware/isSportsHead] - unauthorized access by user: ${req.user.userId}`);
            return res.status(401).json({
                error: 'Unauthorized access.'
            });
        }
        logger_1.default.info(`[/middleware/isSportsHead] - user: ${req.user.userId} authorized`);
        next();
    }
    catch (error) {
        logger_1.default.error(`[/middleware/isSportsHead] - ${error.message}`);
        return res.status(500).json({
            error: 'Failed to authenticate token.'
        });
    }
});
exports.isSportsHead = isSportsHead;
const isUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, userId } = req.body;
        if (!email && !userId) {
            logger_1.default.warn(`[/middleware/isUser] - data missing`);
            logger_1.default.debug(`[/middleware/isUser] - email: ${email}`);
            return res.status(400).json({
                error: "Please provide all the required fields",
            });
        }
        let user;
        if (email) {
            if (!(0, heplers_1.isValidEmail)(email)) {
                logger_1.default.warn(`[/middleware/isUser] - invalid email`);
                logger_1.default.debug(`[/middleware/isUser] - email: ${email}`);
                return res.status(400).json({
                    error: "Please provide a valid email",
                });
            }
            user = yield prisma_1.default.users.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });
        }
        else {
            user = yield prisma_1.default.users.findUnique({
                where: {
                    userId: userId,
                },
            });
        }
        if (!user) {
            logger_1.default.warn(`[/middleware/isUser] - user not found`);
            logger_1.default.debug(`[/middleware/isUser] - email: ${email}`);
            return res.status(400).json({
                error: "User not found",
            });
        }
        logger_1.default.info(`[/middleware/isUser] - user: ${user.userId} found`);
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.default.error(`[/middleware/isUser] - ${error.message}`);
        return res.status(500).json({
            error: `Failed to find user: ${req.body.email}`
        });
    }
});
exports.isUser = isUser;
const isNotVerified = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.debug(`[/middleware/iseNotVerified] - user: ${req.user.userId}.`);
        if (req.user.isVerified) {
            logger_1.default.warn(`[/middleware/iseNotVerified] - user: ${req.user.userId} is already verified`);
            return res.status(400).json({
                error: 'User is already verified.'
            });
        }
        logger_1.default.info(`[/middleware/iseNotVerified] - user: ${req.user.userId} is not verified`);
        next();
    }
    catch (error) {
        logger_1.default.error(`[/middleware/iseNotVerified] - ${error.message}`);
        return res.status(500).json({
            error: `While checking if user: ${req.user.userId} is verified`
        });
    }
});
exports.isNotVerified = isNotVerified;
const mailSent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let tokenData = yield prisma_1.default.verificationToken.findUnique({
            where: {
                sis_id: req.user.userId,
            },
        });
        if (tokenData && tokenData.expiration > new Date()) {
            logger_1.default.warn(`[/middleWare/mailSent] - verification mail already sent`);
            logger_1.default.debug(`[/middleWare/mailSent] - email: ${req.user.email}`);
            const leftTime = new Date(Number(tokenData.expiration) - Date.now());
            return res.status(400).json({
                leftTime,
                error: `Verification mail already sent, you can resend it after ${leftTime.getMinutes() != 0 ? `${leftTime.getMinutes()}:${leftTime.getSeconds()} minutes` : `${leftTime.getSeconds()} seconds`}`,
            });
        }
        next();
    }
    catch (error) {
        logger_1.default.error(`[/middleware/mailSent] - ${error.message}`);
        return res.status(500).json({
            error: `While checking if verification mail is already sent to user: ${req.user.email}`
        });
    }
});
exports.mailSent = mailSent;
const isValidMatch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matchId } = req.params;
        const match = yield prisma_1.default.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: {
                teamAScore: true,
                teamBScore: true,
            }
        });
        if (!match) {
            logger_1.default.warn(`[/middleware/isValidMatch] - match not found`);
            logger_1.default.debug(`[/middleware/isValidMatch] - matchId: ${matchId}`);
            return res.status(404).json({ error: 'Match not found' });
        }
        req.match = match;
        next();
    }
    catch (error) {
        logger_1.default.error(`[/middleware/isValidMatch] - ${error.message}`);
        return res.status(500).json({
            error: `While checking if match: ${req.params.matchId} is valid`
        });
    }
});
exports.isValidMatch = isValidMatch;
const isMatchPlayed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.match) {
            logger_1.default.warn(`[/middleware/isMatchPlayed] - match not found`);
            logger_1.default.debug(`[/middleware/isMatchPlayed] - matchId: ${req.match.matchId}`);
            return res.status(404).json({ error: 'Match not found' });
        }
        if (!req.match.played) {
            logger_1.default.warn(`[/middleware/isMatchPlayed] - match not played yet`);
            logger_1.default.debug(`[/middleware/isMatchPlayed] - matchId: ${req.match.matchId}`);
            return res.status(400).json({ error: 'Match not played' });
        }
        next();
    }
    catch (error) {
        logger_1.default.error(`[/middleware/isMatchPlayed] - ${error.message}`);
        return res.status(500).json({
            error: `While checking if match: ${req.match.matchId} is played`
        });
    }
});
exports.isMatchPlayed = isMatchPlayed;
//# sourceMappingURL=middleware.js.map