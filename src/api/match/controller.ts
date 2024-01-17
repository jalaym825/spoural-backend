import { Request, Response } from 'express';
import logger from '../../utils/logger';
import prisma from '../../utils/prisma';

const getMatches = async (req: Request, res: Response) => {
    try {
        const { year } = req.params;
        if (!year) {
            logger.warn(`[/matches] - data missing`);
            logger.debug(`[/matches] - year: ${year}`);
            return res.status(400).json({
                data: {
                    error: "Invalid year"
                }
            });
        }

        const matches = await prisma.cricketSchedule.findMany({
            where: {
                year: year as string
            },
            orderBy: {
                date: 'desc'
            },
            include: {
                match: {
                    include: {
                        team1: true,
                        team2: true
                    }
                }
            }
        });
        logger.info(`[/matches] - ${matches.length} matches found`);

        return res.status(200).json({
            data: {
                matches
            }
        });
    } catch (error: any) {
        logger.error(`[/matches] - ${error.message}`);
        return res.status(500).json({
            data: {
                error: error.message
            }
        });
    }
}

const addMatch = async (req: Request, res: Response) => {
    try {
        const { year, date, team1Id, team2Id, venue } = req.body;
        if (!year || !date || !team1Id || !team2Id || !venue) {
            logger.warn(`[/matches] - data missing`);
            logger.debug(`[/matches] - year: ${year}, date: ${date}, team1Id: ${team1Id}, team2Id: ${team2Id}, venue: ${venue}`);
            return res.status(400).json({
                data: {
                    error: "Invalid data"
                }
            });
        }

        const match = await prisma.cricketMatch.create({
            data: {
                date,
                team1Id,
                team2Id,
                venue,
            }
        });

        logger.info(`[/matches] - match added, match: ${match.sis_id}`);
        const shcedule = await prisma.cricketSchedule.create({
            data: {
                sis_id: match.sis_id,
                year,
                date,
                team1Id,
                team2Id,
                // matchId: match.sis_id
            }
        });
        logger.info(`[/matches] - match schedule added, schedule: ${shcedule.sis_id}`);

        return res.status(200).json({
            data: {
                match
            }
        });
    } catch (error: any) {
        logger.error(`[/matches] - ${error.message}`);
        return res.status(500).json({
            data: {
                error: error.message
            }
        });
    }
}

interface CustomRequest extends Request {
    match?: any
}

const startMatch = async (req: CustomRequest, res: Response) => {
    try {
        if(req.match.played) {
            logger.warn(`[/matches] - match already started`);
            return res.status(400).json({
                data: {
                    error: "Match already started"
                }
            });
        }

        const match = await prisma.cricketMatch.update({
            where: {
                sis_id: req.match.sis_id
            },
            data: {
                played: true
            }
        });

        logger.info(`[/matches] - match started, match: ${match.sis_id}`);

        return res.status(200).json({
            data: {
                match
            }
        });
    } catch (error: any) {
        logger.error(`[/matches] - ${error.message}`);
        return res.status(500).json({
            data: {
                error: error.message
            }
        });
    }
}

const updateMatchToss = async (req: CustomRequest, res: Response) => {
    try {
        if(req.match.tossWonBy) {
            logger.warn(`[/matches] - match toss already updated`);
            return res.status(400).json({
                data: {
                    error: "Match toss already updated"
                }
            });
        }
        const { tossWonBy } = req.body;
        const match = await prisma.cricketMatch.update({
            where: {
                sis_id: req.match.sis_id
            },
            data: {
                tossWonBy
            },
            include: {
                tossWonByTeam: true
            }
        });

        logger.info(`[/matches/updateMatchToss] - match toss updated, match: ${match.sis_id}`);

        return res.status(200).json({
            data: {
                match
            }
        });
    } catch (error: any) {
        logger.error(`[/matches/updateMatchToss] - ${error.message}`);
        return res.status(500).json({
            data: {
                error: error.message
            }
        });
    }
}

export default { getMatches, addMatch, startMatch, updateMatchToss }