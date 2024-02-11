import { Request, Response } from 'express';
import prisma from '../../utils/prisma';
import logger from '../../utils/logger';
import { isValidEmail } from '../../utils/heplers';
import axios from 'axios';
import mailer from '../../utils/mailer';

function generatePassword(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function generateName() {
    const adjectives = ['Brilliant', 'Spirited', 'Vibrant', 'Genuine', 'Harmonious'];
    const nouns = ['Phoenix', 'Cascade', 'Horizon', 'Zenith', 'Whisper'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return randomAdjective + randomNoun;
}


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
        const { year } = req.params;
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
            include: {
                players: true
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
        const { name } = req.body;
        if (!name) {
            logger.warn(`[/team] - data missing`);
            logger.debug(`[/team] - name: ${name}`);
            return res.status(400).json({
                data: {
                    error: "Invalid data"
                }
            });
        }
        const exist = await prisma.cricketTeam.findFirst({
            where: {
                name: name.toLowerCase()
            }
        })
        if(exist)
        {
            logger.warn(`[/team/addTeam] - team already exists`);
            logger.debug(`[/team/addTeam] - team: ${name}, ${exist.sis_id}`);
            return res.status(400).json({
                data: {
                    error: "Team already exists",
                }
            });
        }

        const team = await prisma.cricketTeam.create({
            data: {
                name: name.toLowerCase(),
                year: new Date(Date.now()).getFullYear().toString()
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
        const { teamId, playerId, playerEmail } = req.body;
        if (!teamId) {
            logger.warn(`[/team/player] - data missing`);
            logger.debug(`[/team/player] - teamId: ${teamId}`);
            return res.status(400).json({
                data: {
                    error: "Invalid data"
                }
            });
        }
        let user: any;
        if (playerEmail) {
            if (isValidEmail(playerEmail) === false) {
                logger.warn(`[/team/player] - invalid email`);
                logger.debug(`[/team/player] - email: ${playerEmail}`);
                return res.status(400).json({
                    data: {
                        error: "Invalid email"
                    }
                });
            }
            user = await prisma.users.findFirst({
                where: {
                    email: playerEmail
                }
            });
        } else {
            user = await prisma.users.findFirst({
                where: {
                    userId: playerId
                }
            });
        }
        if (!user) {
            user = await prisma.users.create({
                data: {
                    userId: playerEmail.split('@')[0],
                    email: playerEmail,
                    name: generateName(), // Add the 'name' property with a default value
                    password: generatePassword(6) // Add the 'password' property with a default value
                }
            });
            await axios.post(`${process.env.SERVER_URL}/auth/sendVerificationMail`, {
                email: playerEmail
            });
        }
        let player:any;
        if(!playerId)
        {
            player  = await prisma.cricketPlayer.create({
                data: {
                    userId: user.userId,
                },
                include: {
                    user: true
                }
            })
        }
        else
        {
            player = await prisma.cricketPlayer.findFirst({
                where: {
                    sis_id: playerId
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
        await mailer.sendAddedToTeamMail(playerEmail, team.name, user.rec_status);
        logger.info(`[/team/player] - ${player.user.userId} added`);
        return res.status(200).json({ data: { team } });
    } catch (error: any) {
        // console.log(error);
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