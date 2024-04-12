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
const logger_1 = __importDefault(require("../../utils/logger"));
const heplers_1 = require("../../utils/heplers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const mailer_1 = __importDefault(require("../../utils/mailer"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
// const genAccRefTokens = async (userId: any) => {
//     try {
//         const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
//             expiresIn: "15m",
//         });
//         const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
//             expiresIn: "7d",
//         });
//         await prisma.users.update({
//             where: {
//                 userId
//             },
//             data: {
//                 refreshToken
//             }
//         });
//         logger.info(`[/auht/genAccRefTokens] - success - ${userId}`);
//         return { accessToken, refreshToken };
//     } catch (err: any) {
//         logger.error(`[/auht/genAccRefTokens] - ${err.message}`);
//         throw new Error("Something went wrong");
//     }
// }
const generateToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        yield prisma_1.default.users.update({
            where: {
                userId
            },
            data: {
                token
            }
        });
        logger_1.default.info(`[/auht/generateToken] - success - ${userId}`);
        return { token };
    }
    catch (err) {
        logger_1.default.error(`[/auht/generateToken] - ${err.message}`);
        throw new Error("Something went wrong");
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, userId, password } = req.body;
        if (!email || !userId || !password) {
            logger_1.default.warn(`[/auth/register] - data missing`);
            logger_1.default.debug(`[/auth/register] - email: ${email}, userId: ${userId}`);
            return res.status(400).json({
                error: "Please provide all the required fields",
            });
        }
        if (!(0, heplers_1.isValidEmail)(email)) {
            logger_1.default.warn(`[/auth/register] - invalid email`);
            logger_1.default.debug(`[/auth/register] - email: ${email}`);
            return res.status(400).json({
                error: "Please provide a valid email",
            });
        }
        const user = yield prisma_1.default.users.findUnique({
            where: {
                email: email.toLowerCase(),
            },
        });
        if (user) {
            logger_1.default.warn(`[/auth/register] - email already exists`);
            logger_1.default.debug(`[/auth/register] - email: ${email}`);
            return res.status(400).json({
                error: "Email already exists",
            });
        }
        const user2 = yield prisma_1.default.users.findUnique({
            where: {
                userId: userId.toLowerCase(),
            },
        });
        if (user2) {
            logger_1.default.warn(`[/auth/register] - userId already exists`);
            logger_1.default.debug(`[/auth/register] - userId: ${userId}`);
            return res.status(400).json({
                error: "UserId already exists",
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield prisma_1.default.users.create({
            data: {
                name,
                email: email.toLowerCase(),
                userId: userId.toLowerCase(),
                password: hashedPassword,
                roles: ["USER"]
            },
        });
        logger_1.default.info(`[/auth/register] - success - ${newUser.userId}`);
        logger_1.default.debug(`[/auth/register] - email: ${email}, userId: ${userId}`);
        const res1 = yield axios_1.default.post(`${process.env.SERVER_URL}/auth/sendVerificationMail`, {
            email: email.toLowerCase()
        });
        if (res1.data.error) {
            return res.status(500).json({
                error: res1.data.error
            });
        }
        return res.status(200).json({
            user: newUser,
            message: "User created successfully",
        });
    }
    catch (err) {
        logger_1.default.error(`[/auth/register] - ${err.message}`);
        return res.status(500).json({
            error: "Something went wrong",
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailOrUserId, password } = req.body;
        if (!emailOrUserId || !password) {
            logger_1.default.warn(`[/auth/login] - data missing`);
            logger_1.default.debug(`[/auth/login] - emailOrUserId: ${emailOrUserId}`);
            return res.status(400).json({
                error: "Please provide all the required fields",
            });
        }
        let user;
        if (!(0, heplers_1.isValidEmail)(emailOrUserId)) {
            user = yield prisma_1.default.users.findUnique({
                where: {
                    userId: emailOrUserId.toLowerCase(),
                },
            });
            if (!user) {
                logger_1.default.warn("[/auth/login]: emailOrUserId invalid");
                logger_1.default.debug(`[/auth/login] - emailOrUserId: ${emailOrUserId}`);
                return res.status(400).json({
                    error: "Please provide a valid emailOrUserId",
                });
            }
        }
        user = yield prisma_1.default.users.findUnique({
            where: {
                email: emailOrUserId.toLowerCase(),
            },
        });
        if (!user) {
            logger_1.default.warn("[/auth/login]: user not found");
            logger_1.default.debug(`[/auth/login] - emailOrUserId: ${emailOrUserId}`);
            return res.status(400).json({
                error: "User not found",
            });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            logger_1.default.warn(`[/auth/login] - incorrect userId/email or password`);
            logger_1.default.debug(`[/auth/login] - ${emailOrUserId}`);
            return res.status(400).json({
                error: "Incorrect username or password",
            });
        }
        const { token } = yield generateToken(user.userId);
        // const { refreshToken, accessToken } = await genAccRefTokens(user.userId);
        logger_1.default.info(`[/auth/login] - success - ${user.sis_id}`);
        logger_1.default.debug(`[/auth/login] - ${emailOrUserId}`);
        let _user = Object.assign({}, user);
        delete _user.password;
        delete _user.refreshToken;
        const options = {
            httpOnly: true,
            secure: true
        };
        return res.status(200)
            // .cookie("accessToken", accessToken, options)
            // .cookie("refreshToken", refreshToken, options)
            .json({
            user: _user,
            token,
            // accessToken,
            // refreshToken
        });
    }
    catch (err) {
        logger_1.default.error(`[/auth/login] - ${err.message}`);
        return res.status(500).json({
            error: "Something went wrong",
        });
    }
});
const sendVerificationMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secretToken = crypto_1.default.randomBytes(32).toString("hex");
        let tokenData = yield prisma_1.default.verificationToken.findUnique({
            where: {
                sis_id: req.user.userId,
            },
        });
        if (tokenData && tokenData.expiration > new Date()) {
            logger_1.default.warn(`[/auth/sendVerificationMail] - verification mail already sent`);
            logger_1.default.debug(`[/auth/sendVerificationMail] - email: ${req.user.email}`);
            return res.status(400).json({
                error: `Verification mail already sent, you can resend it after ${Number(tokenData.expiration) - Date.now()} ms`,
            });
        }
        tokenData = yield prisma_1.default.verificationToken.upsert({
            where: {
                sis_id: req.user.userId,
            },
            update: {
                sis_id: req.user.userId,
                token: secretToken,
                expiration: new Date(Date.now() + 60 * 1000 * 60), // 1 hour
            },
            create: {
                sis_id: req.user.userId,
                token: secretToken,
                expiration: new Date(Date.now() + 60 * 1000 * 60), // 1 hour
            },
        });
        // create env variable for frontend url
        let link = `${process.env.SERVER_URL}/auth/verify/${tokenData.token}`;
        mailer_1.default.sendMail([req.user.email], "Verify your email", {
            html: `<p>Click <a href="${link}">here</a> to verify your email</p>`,
            text: `Click this link to verify your email ${link}`,
        }).then((_info) => {
            logger_1.default.info(`[/auth/sendVerificationMail] - success - ${req.user.userId}`);
            logger_1.default.debug(`[/auth/sendVerificationMail] - email: ${req.user.email}`);
            delete req.user.refreshToken;
            delete req.user.password;
            return res.status(200).json({
                user: req.user,
                message: "Verification mail sent",
            });
        }).catch((_err) => {
            return res.status(400).json({
                error: "Error in sending mail",
            });
        });
    }
    catch (err) {
        logger_1.default.error(`[/auth/sendVerificationMail] - ${err.message}`);
        return res.status(500).json({
            error: "Something went wrong",
        });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
        if (!token) {
            logger_1.default.warn(`[/auth/logout] - token not found`);
            return res.status(400).json({
                error: "Token not found",
            });
        }
        const user = yield prisma_1.default.users.findFirst({
            where: {
                token
            }
        });
        if (!user) {
            logger_1.default.warn(`[/auth/logout] - Invalid token`);
            return res.status(400).json({
                error: "Invalid token",
            });
        }
        yield prisma_1.default.users.update({
            where: {
                userId: user.userId
            },
            data: {
                token: null
            }
        });
        logger_1.default.info(`[/auth/logout] - success - ${user.userId}`);
        const options = {
            httpOnly: true,
            secure: true
        };
        return res.status(200)
            .json({
            message: "User logged out successfully",
        });
    }
    catch (err) {
        logger_1.default.error(`[/auth/logout] - ${err.message}`);
        return res.status(500).json({
            error: "Something went wrong",
        });
    }
});
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        if (!token) {
            logger_1.default.warn(`[/auth/verify] - data missing`);
            logger_1.default.debug(`[/auth/verify] - token: ${token}`);
            return res.status(400).json({
                error: "Please provide all the required fields",
            });
        }
        const tokenData = yield prisma_1.default.verificationToken.findUnique({
            where: {
                token
            }
        });
        if (!tokenData) {
            logger_1.default.warn(`[/auth/verify] - token not found`);
            logger_1.default.debug(`[/auth/verify] - token: ${token}`);
            return res.status(400).json({
                error: "Token not found",
            });
        }
        yield prisma_1.default.verificationToken.delete({
            where: {
                token
            }
        });
        if (tokenData.expiration < new Date()) {
            logger_1.default.warn(`[/auth/verify] - token expired`);
            logger_1.default.debug(`[/auth/verify] - token: ${token}`);
            return res.status(400).json({
                error: "Token expired",
            });
        }
        const user = yield prisma_1.default.users.findUnique({
            where: {
                userId: tokenData.sis_id
            }
        });
        if (!user) {
            logger_1.default.warn(`[/auth/verify] - user not found`);
            logger_1.default.debug(`[/auth/verify] - token: sis_id: ${tokenData.sis_id}`);
            return res.status(400).json({
                error: "User not found",
            });
        }
        if (user.rec_status) {
            logger_1.default.warn(`[/auth/verify] - user already verified`);
            logger_1.default.debug(`[/auth/verify] - userId: ${user.userId}`);
            return res.status(400).json({
                error: "User is already verified",
            });
        }
        yield prisma_1.default.users.update({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.userId
            },
            data: {
                rec_status: true
            }
        });
        logger_1.default.info(`[/auth/verify] - success - ${user.userId}`);
        logger_1.default.debug(`[/auth/verify] - userId: ${user.userId}, token: ${token}`);
        return res.status(200).json({
            message: "User verified successfully",
        });
    }
    catch (err) {
        logger_1.default.error(`[/auth/verify] - ${err.message}`);
        return res.status(500).json({
            error: "Something went wrong",
        });
    }
});
// const refreshAccessToken = async (req: Request, res: Response) => {
//     try {
//         const { refreshToken } = req.cookies || req.body;
//         if (!refreshToken) {
//             logger.warn(`[/auth/refreshAccessToken] - refreshToken not found or invalid token`);
//             return res.status(400).json({
//                 data: {
//                     error: "Refresh token not found or invalid token",
//                 }
//             });
//         }
//         const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload;
//         const user = await prisma.users.findUnique({
//             where: {
//                 userId: decoded.userId
//             }
//         });
//         if (!user) {
//             logger.warn(`[/auth/refreshAccessToken] - invalid refresh token`);
//             return res.status(400).json({
//                 data: {
//                     error: "Invalid refresh token",
//                 }
//             });
//         }
//         if (refreshToken !== user.refreshToken) {
//             logger.warn(`[/auth/refreshAccessToken] - invalid refresh token`);
//             return res.status(400).json({
//                 data: {
//                     error: "Invalid refresh token",
//                 }
//             });
//         }
//         const { accessToken, refreshToken: newRefreshToken } = await genAccRefTokens(user.userId);
//         logger.info(`[/auth/refreshAccessToken] - success - ${user.userId}`);
//         const options = {
//             httpOnly: true,
//             secure: true
//         }
//         return res.status(200)
//             .cookie("accessToken", accessToken, options)
//             .cookie("refreshToken", newRefreshToken, options)
//             .json({
//                 data: {
//                     accessToken, refreshToken: newRefreshToken,
//                     mesage: `Access token refreshed successfully`
//                 }
//             });
//     } catch (err: any) {
//         logger.error(`[/auth/refreshAccessToken] - ${err.message}`);
//         return res.status(500).json({
//             data: {
//                 error: "Something went wrong",
//             }
//         });
//     }
// }
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            user: req.user
        });
    }
    catch (err) {
        logger_1.default.error(`[/auth/getUser] - ${err.message}`);
        return res.status(500).json({
            error: "Something went wrong",
        });
    }
});
exports.default = { login, register, sendVerificationMail, logout, verify, getUser };
//# sourceMappingURL=controller.js.map