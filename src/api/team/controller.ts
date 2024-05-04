import axios from 'axios';
import { Request, Response } from 'express';
import { generateName, generatePassword, getUserByRollNo, isValidEmail } from '../../utils/heplers';
import logger from '../../utils/logger';
import mailer from '../../utils/mailer';
import prisma from '../../utils/prisma';


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

const addPlayer = async (req: Request, res: Response) => {
    try {
        let { teamId, playerEmail, userId, playerCategory, playerName } = req.body;
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
        if (!userId) {
            userId = playerEmail.split("@")[0];
        }

        let user = await prisma.users.findUnique({
            where: {
                email: playerEmail
            }
        });
        if (!user) {
            console.log(userId);
            user = await prisma.users.create({
                data: {
                    userId,
                    email: playerEmail,
                    name: userId ? await getUserByRollNo(userId) : generateName(), // Add the 'name' property with a default value
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
                isAllRounder: playerCategory === "ALL_ROUNDER",
                isBatsman: playerCategory === "BATSMAN",
                isBowler: playerCategory === "BOWLER",
                isWicketKeeper: playerCategory === "BATSMAN_WK",
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
                    },
                }
            },
            include: {
                players: true
            }
        });
        mailer.sendAppliedMail(playerEmail, team.name, user.rec_status);
        logger.info(`[/team/player] - ${player.user.userId} added`);
        return res.status(200).json({ team, player });
    } catch (error: any) {
        console.log(error);
        logger.error(`[/team/player] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const getPlayers = async (req: Request, res: Response) => {
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

        team = await prisma.cricketTeam.findFirst({
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
        mailer.sendSelectionMail(emails, team.name);
        logger.info(`[/team/sendSelectionMail/:teamId] - mail sent to ${emails.length} players`);
        return res.status(200).json({ message: "Mail sent" });
    } catch (error: any) {
        logger.error(`[/team/sendSelectionMail/:teamId] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const getScoreCard = async (req: Request, res: Response) => {
    try {
        const { teamId, matchId } = req.params;
        if (!teamId || !matchId) {
            logger.warn(`[/team/battinscore/:teamId] - data missing`);
            logger.debug(`[/team/battinscore/:teamId] - teamId: ${teamId} matchId: ${matchId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const team = await prisma.cricketTeam.findUnique({
            where: {
                sis_id: teamId
            }
        });
        if (!team) {
            logger.warn(`[/team/battinscore/:teamId] - team not found`);
            logger.debug(`[/team/battinscore/:teamId] - teamId: ${teamId}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        const scoreCard = await prisma.cricketMatchTeamData.findUnique({
            where: {
                teamId_matchId: {
                    teamId, matchId
                }
            },
            include: {
                batters: {
                    include: {
                        player: {
                            include: {
                                user: true,
                            },
                        },
                    },
                    orderBy: {
                        sis_id: 'asc'
                    }
                },
                bowlers: {
                    include: {
                        player: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        sis_id: 'asc'
                    }
                }
            },
        });
        logger.info(`[/team/battinscore/:teamId] - scorecard found for ${team.name} | ${team.sis_id}`);
        return res.status(200).json({ scoreCard });
    } catch (error: any) {
        logger.error(`[/team/battinscore/:teamId] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const getBattingScore = async (req: Request, res: Response) => {
    try {
        let { teamId, matchId, played = false } = req.params;
        played = played === 'true';
        if (!teamId || !matchId) {
            logger.warn(`[/team/battinscore/:teamId] - data missing`);
            logger.debug(`[/team/battinscore/:teamId] - teamId: ${teamId} matchId: ${matchId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const team = await prisma.cricketTeam.findUnique({
            where: {
                sis_id: teamId
            }
        });
        if (!team) {
            logger.warn(`[/team/battinscore/:teamId] - team not found`);
            logger.debug(`[/team/battinscore/:teamId] - teamId: ${teamId}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        const data: any = {};
        if (played) {
            data.played = played;
        }

        const batters = await prisma.cricketMatchPlayerBattingScore.findMany({
            where: {
                ...data,
                teamId,
                matchId
            },
            include: {
                player: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                sis_id: 'asc'
            }
        });
        logger.info(`[/team/battinscore/:teamId] - scorecard found for ${team.name} | ${team.sis_id}`);
        return res.status(200).json({ batters });
    } catch (error: any) {
        logger.error(`[/team/battinscore/:teamId] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const getBowlingScore = async (req: Request, res: Response) => {
    try {
        let { teamId, matchId, played = false } = req.params;
        played = played === "true"
        if (!teamId || !matchId) {
            logger.warn(`[/team/bowlersscore/:teamId] - data missing`);
            logger.debug(`[/team/bowlersscore/:teamId] - teamId: ${teamId} matchId: ${matchId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const team = await prisma.cricketTeam.findUnique({
            where: {
                sis_id: teamId
            }
        });
        if (!team) {
            logger.warn(`[/team/bowlersscore/:teamId] - team not found`);
            logger.debug(`[/team/bowlersscore/:teamId] - teamId: ${teamId}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        const data: any = {};
        if (played) {
            data.played = played;
        }
        const bowlers = await prisma.cricketMatchPlayerBowlingScore.findMany({
            where: {
                ...data,
                teamId,
                matchId
            },
            include: {
                player: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                sis_id: 'asc'
            }
        });
        logger.info(`[/team/bowlersscore/:teamId] - scorecard found for ${team.name} | ${team.sis_id}`);
        return res.status(200).json({ bowlers });
    } catch (error: any) {
        logger.error(`[/team/bowlersscore/:teamId] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const getPlayingXI = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn(`[/team/:id/playingxi] - data missing`);
            logger.debug(`[/team/:id/playingxi] - id: ${id}`);
            return res.status(400).json({
                error: "Invalid id"
            });
        }
        const team = await prisma.cricketTeam.findFirst({
            where: {
                sis_id: id
            },
            select: {
                players: {
                    where: {
                        isSelected: true
                    },
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!team) {
            logger.warn(`[/team/:id/playingxi] - team not found`);
            logger.debug(`[/team/:id/playingxi] - id: ${id}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        logger.info(`[/team/:id/playingxi] - ${team.players.length} players found`);
        return res.status(200).json({ players: team.players });
    } catch (error: any) {
        logger.error(`[/team/:id/playingxi] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

export default { getTeams, addTeam, addPlayer, getTeam, getPlayers, getTeamByName, selectPlayer, removePlayer, sendSelectionMail, getScoreCard, getBattingScore, getBowlingScore, getPlayingXI }