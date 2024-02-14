import { Request, Response } from 'express';
import logger from '../../utils/logger';
import prisma from '../../utils/prisma';
import mailer from '../../utils/mailer';

interface AuthenticatedRequest extends Request {
    user?: any
    match?: any
}

const getPlayer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn(`[/player] - data missing`);
            logger.debug(`[/player] - id: ${id}`);
            return res.status(400).json({
                error: "Invalid id"
            });
        }

        const player = await prisma.cricketPlayer.findFirst({
            where: {
                sis_id: id
            },
        });
        logger.info(`[/player] - player found`);

        return res.status(200).json({
            player
        });
    } catch (error: any) {
        logger.error(`[/player] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const addPlayer = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { isWicketKeeper = false, isAllRounder = false, isBatsman = false, isBowler = false, teamId } = req.body;
        if (!teamId) {
            logger.warn(`[/player] - data missing`);
            logger.debug(`[/player] - teamId: ${teamId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const team = await prisma.cricketTeam.findFirst({
            where: {
                sis_id: teamId
            }
        });
        if (!team) {
            logger.warn(`[/player] - team not found`);
            logger.debug(`[/player] - teamId: ${teamId}`);
            return res.status(400).json({
                error: "Invalid team"
            });
        }

        const playerExists = await prisma.cricketPlayer.findFirst({
            where: {
                userId: req.user.userId
            }
        });

        if (playerExists) {
            logger.warn(`[/player] - player already exists`);
            return res.status(400).json({
                error: "Player already exists"
            });
        }

        const player = await prisma.cricketPlayer.create({
            data: {
                userId: req.user.userId,
                isWicketKeeper,
                isAllRounder,
                isBatsman,
                isBowler
            }
        });
        await mailer.sendAppliedMail(req.user.email, team.name);
        logger.info(`[/player] - player added`);
        return res.status(200).json({ player });
    }
    catch (error: any) {
        logger.error(`[/player] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

export default { getPlayer, addPlayer }