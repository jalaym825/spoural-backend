import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from "./logger";
import prisma from './prisma';
import { isValidEmail } from "./heplers";


const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        logger.warn(`[/middleware/verifyJWT] - token missing`);
        logger.debug(`[/middleware/verifyJWT] - token: ${token}`);
        return res.status(401).json({
            error: 'No token provided.'
        });
    }
    try {
        const payload = await jwt.verify(token.toString(), process.env.JWT_SECRET!) as JwtPayload;
        const user = await prisma.users.findUnique({
            where: {
                userId: payload.userId
            }
        });

        if (!user) {
            logger.warn(`[/middleware/verifyJWT] - user not found`);
            return res.status(401).json({
                error: 'Invalid access token.'
            });
        }
        logger.info(`[/middleware/verifyJWT] - user: ${user?.userId} authenticated`);
        req.user = user;
        next();
    } catch (error: any) {
        logger.error(`[/middleware/verifyJWT] - ${error.message}`);
        return res.status(500).json({
            error: 'Failed to authenticate token.'
        });
    }
}

const isSportsHead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug(`[/middleware/isSportsHead] - user: ${req.user.userId}, role: ${req.user.roles}`);
        if (!req.user.roles.includes('SPORTS_HEAD')) {
            logger.warn(`[/middleware/isSportsHead] - unauthorized access by user: ${req.user.userId}`);
            return res.status(401).json({
                error: 'Unauthorized access.'
            });
        }
        logger.info(`[/middleware/isSportsHead] - user: ${req.user.userId} authorized`);
        next();
    } catch (error: any) {
        logger.error(`[/middleware/isSportsHead] - ${error.message}`);
        return res.status(500).json({
            error: 'Failed to authenticate token.'
        });
    }
}

const isUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, userId } = req.body;
        if (!email && !userId) {
            logger.warn(`[/middleware/isUser] - data missing`);
            logger.debug(`[/middleware/isUser] - email: ${email}`);
            return res.status(400).json({
                error: "Please provide all the required fields",
            });
        }
        let user: any;
        if (email) {
            if (!isValidEmail(email)) {
                logger.warn(`[/middleware/isUser] - invalid email`);
                logger.debug(`[/middleware/isUser] - email: ${email}`);
                return res.status(400).json({
                    error: "Please provide a valid email",
                });
            }
            user = await prisma.users.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });
        } else {
            user = await prisma.users.findUnique({
                where: {
                    userId: userId,
                },
            });
        }
        if (!user) {
            logger.warn(`[/middleware/isUser] - user not found`);
            logger.debug(`[/middleware/isUser] - email: ${email}`);
            return res.status(400).json({
                error: "User not found",
            });
        }
        logger.info(`[/middleware/isUser] - user: ${user.userId} found`);
        req.user = user;
        next();
    } catch (error: any) {
        logger.error(`[/middleware/isUser] - ${error.message}`);
        return res.status(500).json({
            error: `Failed to find user: ${req.body.email}`
        });
    }
}

const isNotVerified = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug(`[/middleware/iseNotVerified] - user: ${req.user.userId}.`);
        if (req.user.rec_status === true) {
            logger.warn(`[/middleware/iseNotVerified] - user: ${req.user.userId} is already verified`);
            return res.status(400).json({
                error: 'User is already verified.'
            });
        }
        logger.info(`[/middleware/iseNotVerified] - user: ${req.user.userId} is not verified`);
        next();
    } catch (error: any) {
        logger.error(`[/middleware/iseNotVerified] - ${error.message}`);
        return res.status(500).json({
            error: `While checking if user: ${req.user.userId} is verified`
        });
    }
}

const mailSent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let tokenData = await prisma.verificationToken.findUnique({
            where: {
                sis_id: req.user.userId,
            },
        });
        if (tokenData && tokenData.expiration > new Date()) {
            logger.warn(`[/middleWare/mailSent] - verification mail already sent`);
            logger.debug(`[/middleWare/mailSent] - email: ${req.user.email}`);
            const leftTime = new Date(Number(tokenData.expiration) - Date.now());
            return res.status(400).json({
                leftTime,
                error: `Verification mail already sent, you can resend it after ${leftTime.getMinutes() != 0 ? `${leftTime.getMinutes()}:${leftTime.getSeconds()} minutes` : `${leftTime.getSeconds()} seconds`}`,
            })
        }
        next();
    } catch (error: any) {
        logger.error(`[/middleware/mailSent] - ${error.message}`);
        return res.status(500).json({
            error: `While checking if verification mail is already sent to user: ${req.user.email}`
        });
    }
}

const isValidMatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { matchId } = req.params;
        const match = await prisma.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: {
                teamAScore: true,
                teamBScore: true,
                battingTeamScore: true,
                bowlingTeamScore: true,
                currentOver: {
                    include: {
                        strikerScore: {
                            include: {
                                player: true
                            }
                        },
                        nonStrikerScore: {
                            include: {
                                player: true
                            }
                        },
                        bowlerScore: {
                            include: {
                                player: true
                            }
                        },
                    }
                },
            }
        })
        if (!match) {
            logger.warn(`[/middleware/isValidMatch] - match not found`);
            logger.debug(`[/middleware/isValidMatch] - matchId: ${matchId}`);
            return res.status(404).json({ error: 'Match not found' })
        }
        req.match = match;
        next();
    } catch (error: any) {
        logger.error(`[/middleware/isValidMatch] - ${error.message}`);
        return res.status(500).json({
            error: `While checking if match: ${req.params.matchId} is valid`
        });
    }
}

const isMatchPlayed = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.match) {
            logger.warn(`[/middleware/isMatchPlayed] - match not found`);
            logger.debug(`[/middleware/isMatchPlayed] - matchId: ${req.match.sis_id}`);
            return res.status(404).json({ error: 'Match not found' })
        }
        if (!req.match.played) {
            logger.warn(`[/middleware/isMatchPlayed] - match not played yet`);
            logger.debug(`[/middleware/isMatchPlayed] - matchId: ${req.match.sis_id}`);
            return res.status(400).json({ error: 'Match not played' })
        }
        next();
    } catch (error: any) {
        logger.error(`[/middleware/isMatchPlayed] - ${error.message}`);
        return res.status(500).json({
            error: `While checking if match: ${req.match.sis_id} is played`
        });
    }
}



export { verifyJWT, isSportsHead, isUser, isNotVerified, mailSent, isValidMatch, isMatchPlayed };