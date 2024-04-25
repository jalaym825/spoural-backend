import { Request, Response } from 'express';
import logger from '../../utils/logger';
import prisma from '../../utils/prisma';
import { load } from 'cheerio';
import axios from 'axios';
import {getUserByRollNo as getUserFromId} from '../../utils/heplers'
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

const getUserByRollNo = async (req: Request, res: Response) => {
    try {
        const response = await getUserFromId(req.params.rollNo)
        res.status(200).json({ name: response });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export default { getUser, getUserByRollNo }