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
                error: "Invalid id"
            });
        }
        const team = await prisma.cricketTeam.findUnique({
            where: {
                sis_id: id
            },
            include: {
                players: {
                    where: {
                        isSelected: true
                    }
                }
            }
        });
        if (!team) {
            logger.warn(`[/team/:id] - team not found`);
            logger.debug(`[/team/:id] - id: ${id}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        logger.info(`[/team/:id] - ${team.name} found`);
        return res.status(200).json({ team });
    } catch (error: any) {
        logger.error(`[/team/:id] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const getTeamByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        if (!name) {
            logger.warn(`[/getTeamByName/:name] - data missing`);
            logger.debug(`[/getTeamByName/:name] - name: ${name}`);
            return res.status(400).json({
                error: "Invalid name"
            });
        }
        const team = await prisma.cricketTeam.findFirst({
            where: {
                name: name.toLowerCase(),
                year: new Date(Date.now()).getFullYear().toString()
            },
        });
        if (!team) {
            logger.warn(`[/getTeamByName/:name] - team not found`);
            logger.debug(`[/getTeamByName/:name] - name: ${name}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        logger.info(`[/getTeamByName/:name] - ${team.name} found`);
        return res.status(200).json({ team });
    } catch (error: any) {
        logger.error(`[/team/:id] - ${error.message}`);
        return res.status(500).json({
            error: error.message
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
                error: "Invalid year"
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
        return res.status(200).json({ teams });
    } catch (error: any) {
        logger.error(`[/team] - ${error.message}`);
        return res.status(500).json({
            error: error.message
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
                error: "Invalid data"
            });
        }
        const exist = await prisma.cricketTeam.findFirst({
            where: {
                name: name.toLowerCase()
            }
        })
        if (exist) {
            logger.warn(`[/team/addTeam] - team already exists`);
            logger.debug(`[/team/addTeam] - team: ${name}, ${exist.sis_id}`);
            return res.status(400).json({
                error: "Team already exists",
            });
        }

        const team = await prisma.cricketTeam.create({
            data: {
                name: name.toLowerCase(),
                year: new Date(Date.now()).getFullYear().toString()
            }
        });
        logger.info(`[/team] - ${team.name} added`);
        return res.status(200).json({ team });
    } catch (error: any) {
        logger.error(`[/team] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

interface AuthenticatedRequest extends Request {
    user?: any
}

const addPlayer = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { teamId, playerEmail, userId } = req.body;
        if (!teamId || !playerEmail) {
            logger.warn(`[/team/player] - data missing`);
            logger.debug(`[/team/player] - teamId: ${teamId} playerEmail: ${playerEmail}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        if (isValidEmail(playerEmail) === false) {
            logger.warn(`[/team/player] - invalid email`);
            logger.debug(`[/team/player] - email: ${playerEmail}`);
            return res.status(400).json({
                error: "Invalid email"
            });
        }
        let user = await prisma.users.findUnique({
            where: {
                email: playerEmail
            }
        });
        if (!user) {
            user = await prisma.users.create({
                data: {
                    userId,
                    email: playerEmail,
                    name: generateName(), // Add the 'name' property with a default value
                    password: generatePassword(6) // Add the 'password' property with a default value
                }
            });
            await axios.post(`${process.env.SERVER_URL}/auth/sendVerificationMail`, {
                email: playerEmail
            });
        }
        let player = await prisma.cricketPlayer.findUnique({
            where: {
                userId
            },
            include: {
                user: true
            }
        })
        if (player) {
            logger.warn(`[/team/player] - player already exists`);
            logger.debug(`[/team/player] - player: ${player.user.userId}`);
            return res.status(400).json({
                error: "Player have already applied for the team selection"
            });
        }
        player = await prisma.cricketPlayer.create({
            data: {
                teamId,
                userId,
            },
            include: {
                user: true
            }
        })

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
        await mailer.sendAppliedMail(playerEmail, team.name, user.rec_status);
        logger.info(`[/team/player] - ${player.user.userId} added`);
        return res.status(200).json({ team });
    } catch (error: any) {
        logger.error(`[/team/player] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const getPlayers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const selectedPlayers = req.query.selectedPlayers === 'true';

        if (!id) {
            logger.warn(`[/team/:id/players] - data missing`);
            logger.debug(`[/team/:id/players] - id: ${id}`);
            return res.status(400).json({
                error: "Invalid id"
            });
        }

        // if (selectedPlayers === false) {
        //     if (!req.user.roles.includes("SPORTS_HEAD") || !req.user.roles.includes("DEPT_SPORTS_CC")) {
        //         logger.warn(`[/team/:id/players] - unauthorized access`);
        //         logger.debug(`[/team/:id/players] - id: ${id}`);
        //         return res.status(401).json({
        //             error: "Unauthorized access"
        //         });
        //     }
        // }

        let team;
        const include: any = {
            players: {
                include: {
                    user: true
                },
                orderBy: {
                    isSelected: 'desc'
                }
            }
        };

        if (selectedPlayers) {
            include.players.where = {
                isSelected: true
            };
        }

        team = await prisma.cricketTeam.findUnique({
            where: {
                sis_id: id
            },
            include: include
        });

        if (!team) {
            logger.warn(`[/team/:id/players] - team not found`);
            logger.debug(`[/team/:id/players] - id: ${id}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }

        // if (!req.user.roles.includes("SPORTS_HEAD") && req.user.roles.includes("DEPT_SPORTS_CC") && req.user.department.toLowerCase() !== team.name.toLowerCase()) {
        //     logger.warn(`[/team/:id/players] - unauthorized access`);
        //     logger.debug(`[/team/:id/players] - id: ${id}`);
        //     return res.status(401).json({
        //         error: "Unauthorized access"
        //     });
        // }

        logger.info(`[/team/:id/players] - ${team.name} found`);
        return res.status(200).json({ players: team.players });
    } catch (error: any) {
        console.log(error)
        logger.error(`[/team/:id/players] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const selectPlayer = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params;
        if (!playerId) {
            logger.warn(`[/team/player/:id] - data missing`);
            logger.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        let player = await prisma.cricketPlayer.findUnique({
            where: {
                sis_id: playerId
            }
        })
        if (!player) {
            logger.warn(`[/team/player/:id] - player not found`);
            logger.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(404).json({
                error: "Player not found"
            });
        }

        if (player.isSelected) {
            logger.warn(`[/team/player/:id] - player already selected`);
            logger.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(400).json({
                error: "Player already selected"
            });
        }

        player = await prisma.cricketPlayer.update({
            where: {
                sis_id: playerId
            },
            data: {
                isSelected: true
            },
            include: {
                user: true
            }
        });
        logger.info(`[/team/player/:id] - ${player.sis_id} selected`);
        return res.status(200).json({ player });
    } catch (error: any) {
        logger.error(`[/team/player/:id] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const removePlayer = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params;
        if (!playerId) {
            logger.warn(`[/team/player/:id] - data missing`);
            logger.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        let player = await prisma.cricketPlayer.findUnique({
            where: {
                sis_id: playerId
            }
        })
        if (!player) {
            logger.warn(`[/team/player/:id] - player not found`);
            logger.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(404).json({
                error: "Player not found"
            });
        }

        if (!player.isSelected) {
            logger.warn(`[/team/player/:id] - player already selected`);
            logger.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(400).json({
                error: "Player isn't in team."
            });
        }

        player = await prisma.cricketPlayer.update({
            where: {
                sis_id: playerId
            },
            data: {
                isSelected: false
            },
            include: {
                user: true
            }
        });
        logger.info(`[/team/player/:id] - ${player.sis_id} got rejected`);
        return res.status(200).json({ player });
    } catch (error: any) {
        logger.error(`[/team/player/:id] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const sendSelectionMail = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        if (!teamId) {
            logger.warn(`[/team/sendSelectionMail/:teamId] - data missing`);
            logger.debug(`[/team/sendSelectionMail/:teamId] - teamId: ${teamId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const team = await prisma.cricketTeam.findUnique({
            where: {
                sis_id: teamId
            },
            include: {
                players: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!team) {
            logger.warn(`[/team/sendSelectionMail/:teamId] - team not found`);
            logger.debug(`[/team/sendSelectionMail/:teamId] - teamId: ${teamId}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        let selectedPlayers = team.players.filter((player: any) => player.isSelected);
        if (selectedPlayers.length === 0) {
            logger.warn(`[/team/sendSelectionMail/:teamId] - no players selected`);
            logger.debug(`[/team/sendSelectionMail/:teamId] - teamId: ${teamId}`);
            return res.status(400).json({
                error: "No players selected"
            });
        }
        let emails = selectedPlayers.map((player: any) => player.user.email);
        await mailer.sendSelectionMail(emails, team.name);
        logger.info(`[/team/sendSelectionMail/:teamId] - mail sent to ${emails.length} players`);
        return res.status(200).json({ message: "Mail sent" });
    } catch (error: any) {
        logger.error(`[/team/sendSelectionMail/:teamId] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

export default { getTeams, addTeam, addPlayer, getTeam, getPlayers, getTeamByName, selectPlayer, removePlayer, sendSelectionMail }