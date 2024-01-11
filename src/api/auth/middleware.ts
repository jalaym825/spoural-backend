import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
interface AuthenticatedRequest extends Request {
    user?: any
}
const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            data: {
                error: 'No token provided.'
            }
        });
    }
    try {
        const payload = await jwt.verify(token.toString(), process.env.JWT_SECRET!) as JwtPayload;
        const user = await prisma.user.findFirst({
            where: {
                userId: payload.userId
            } 
        });
        if (!user) {
            return res.status(401).json({
                data: {
                    error: 'Invalid access token.'
                }
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to authenticate token.'
        });
    }
}

export { verifyJWT };