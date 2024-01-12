

import { Request, Response } from 'express';
import prisma from '../../utils/prisma';
import logger from '../../utils/logger';

const getTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn(`[/team/:id] - data missing`);
            logger.debug(`[/team/:id] - id: ${id}`);
            return res.status(400).json({
                data: {
                    error: "Invalid id"
                }
            });
        }
        const team = await prisma.cricketTeam.findFirst({
            where: {
                sis_id: id
            },
            include: {
                players: true
            }
        });
        if (!team) {
            logger.warn(`[/team/:id] - team not found`);
            logger.debug(`[/team/:id] - id: ${id}`);
            return res.status(404).json({
                data: {
                    error: "Team not found"
                }
            });
        }
        logger.info(`[/team/:id] - ${team.name} found`);
        return res.status(200).json({ data: { team } });
    } catch (error: any) {
        logger.error(`[/team/:id] - ${error.message}`);
        return res.status(500).json({
            data: {
                error: error.message
            }
        });
    }
}

const getTeams = async (req: Request, res: Response) => {
    try {
        const { year } = req.query;
        if (!year) {
            logger.warn(`[/team] - data missing`);
            logger.debug(`[/team] - year: ${year}`);
            return res.status(400).json({
                data: {
                    error: "Invalid year"
                }
            });
        }
        const teams = await prisma.cricketTeam.findMany({
            where: {
                year: year as string
            },
            orderBy: {
                name: 'asc'
            }
        });
        logger.info(`[/team] - ${teams.length} teams found`);
        return res.status(200).json({ data: { teams } });
    } catch (error: any) {
        logger.error(`[/team] - ${error.message}`);
        return res.status(500).json({
            data: {
                error: error.message
            }
        });
    }
}

const addTeam = async (req: Request, res: Response) => {
    try {
        const { name, year } = req.body;
        if (!name || !year) {
            logger.warn(`[/team] - data missing`);
            logger.debug(`[/team] - name: ${name}, year: ${year}`);
            return res.status(400).json({
                data: {
                    error: "Invalid data"
                }
            });
        }
        const team = await prisma.cricketTeam.create({
            data: {
                name,
                year
            }
        });
        logger.info(`[/team] - ${team.name} added`);
        return res.status(200).json({ data: { team } });
    } catch (error: any) {
        logger.error(`[/team] - ${error.message}`);
        return res.status(500).json({
            data: {
                error: error.message
            }
        });
    }
}

interface AuthenticatedRequest extends Request {
    user?: any
}

const addPlayer = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { teamId, playerId } = req.body;
        if (!teamId) {
            logger.warn(`[/team/player] - data missing`);
            logger.debug(`[/team/player] - teamId: ${teamId}`);
            return res.status(400).json({
                data: {
                    error: "Invalid data"
                }
            });
        }
        let player = await prisma.cricketPlayer.findFirst({
            where: {
                userId: playerId
            },
            include: {
                user: true
            }
        });
        if (!player) {
            player = await prisma.cricketPlayer.create({
                data: {
                    userId: playerId,
                },
                include: {
                    user: true
                }
            });
        }
        const team = await prisma.cricketTeam.update({
            where: {
                sis_id: teamId
            },
            data: {
                players: {
                    connect: {
                        sis_id: player.sis_id
                    }
                }
            },
            include: {
                players: true
            }
        });
        logger.info(`[/team/player] - ${player.user.userId} added`);
        return res.status(200).json({ data: { team } });
    } catch (error: any) {
        logger.error(`[/team/player] - ${error.message}`);
        return res.status(500).json({
            data: {
                error: error.message
            }
        });
    }
}

const getPlayers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn(`[/team/:id/players] - data missing`);
            logger.debug(`[/team/:id/players] - id: ${id}`);
            return res.status(400).json({
                data: {
                    error: "Invalid id"
                }
            });
        }
        const team = await prisma.cricketTeam.findFirst({
            where: {
                sis_id: id
            },
            select: {
                name: true,
                players: true
            }
        });
        if (!team) {
            logger.warn(`[/team/:id/players] - team not found`);
            logger.debug(`[/team/:id/players] - id: ${id}`);
            return res.status(404).json({
                data: {
                    error: "Team not found"
                }
            });
        }
        logger.info(`[/team/:id/players] - ${team.name} found`);
        return res.status(200).json({ data: { players: team.players } });
    } catch (error: any) {
        logger.error(`[/team/:id/players] - ${error.message}`);
        return res.status(500).json({
            data: {
                error: error.message
            }
        });
    }
}

export default { getTeams, addTeam, addPlayer, getTeam, getPlayers }