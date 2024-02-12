import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from "../../utils/logger";
const prisma = new PrismaClient();
interface AuthenticatedRequest extends Request {
    user?: any
}
const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        logger.warn(`[/matches] - token missing`);
        logger.debug(`[/matches] - token: ${token}`);
        return res.status(401).json({
            data: {
                error: 'No token provided.'
            }
        });
    }
    try {
        let payload: JwtPayload;
        try {
            payload = await jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        } catch (error) {
            logger.error(`[/matches] - Invalid token: ${error.message}`);
            return res.status(401).json({
                data: {
                    error: 'Invalid token.'
                }
            });
        }

        const user = await prisma.users.findFirst({
            where: {
                userId: payload.userId
            }
        });

        if (!user) {
            logger.warn(`[/matches] - user not found`);
            return res.status(401).json({
                data: {
                    error: 'Invalid access token.'
                }
            });
        }
        logger.info(`[/matches] - user: ${user?.userId} authenticated`);
        req.user = user;
        next();
    } catch (error: any) {
        logger.error(`[/matches] - ${error.message}`);
        return res.status(500).json({
            error: 'Failed to authenticate token.'
        });
    }
}

const isSportsHead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        logger.debug(`[/matches] - user: ${req.user.userId}, role: ${req.user.role}`);
        if (req.user.role !== 'SPORTS_HEAD') {
            logger.warn(`[/matches] - unauthorized access by user: ${req.user.userId}`);
            return res.status(401).json({
                data: {
                    error: 'Unauthorized access.'
                }
            });
        }
        logger.info(`[/matches] - user: ${req.user.userId} authorized`);
        next();
    } catch (error: any) {
        logger.error(`[/matches] - ${error.message}`);
        return res.status(500).json({
            error: 'Failed to authenticate token.'
        });
    }
}

export { verifyJWT, isSportsHead };