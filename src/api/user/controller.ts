import { Request, Response } from 'express';
import logger from '../../utils/logger';
import prisma from '../../utils/prisma';

const getUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                userId: req.params.userId
            },
            include:
            {
                cricketPlayer: true,
            }
        });
        res.status(200).json({ user });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export default { getUser }