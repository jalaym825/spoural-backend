import { CricketMatchPlayerBattingScore, CricketMatchPlayerBowlingScore } from '@prisma/client';
import { Request, Response } from 'express';
import logger from '../../utils/logger';
import prisma from '../../utils/prisma';

const getMatches = async (req: Request, res: Response) => {
    try {
        const { year } = req.params;

        // Input validation
        if (!year || !/^\d{4}$/.test(year)) {
            logger.warn(`[/matches] - Invalid year parameter: ${year}`);
            return res.status(400).json({
                error: "Invalid year parameter"
            });
        }

        const matches = await prisma.cricketMatch.findMany({
            where: {
                year: year
            },
            orderBy: {
                date: 'desc'
            },
            include: {
                teamAScore: {
                    include: {
                        team: true
                    }
                },
                teamBScore: {
                    include: {
                        team: true
                    }
                },
                wonByTeamScore: true
            }
        });

        logger.info(`[/matches] - ${matches.length} matches found for year ${year}`);

        return res.status(200).json({
            matches
        });
    } catch (error: any) {
        logger.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

const getMatch = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;

        // Input validation
        if (!matchId) {
            logger.warn(`[/matches] - Invalid or missing matchId parameter`);
            return res.status(400).json({
                error: "Invalid match id"
            });
        }

        const match = await prisma.cricketMatch.findUnique({
            where: {
                sis_id: matchId
            },
            include: {
                battingTeamScore: {
                    include: {
                        team: true
                    }
                },
                bowlingTeamScore: {
                    include: {
                        team: true
                    }
                },
                teamAScore: {
                    include: {
                        team: true
                    }
                },
                teamBScore: {
                    include: {
                        team: true
                    }
                },
                wonByTeamScore: true,
                currentOver: {
                    include: {
                        strikerScore: {
                            include: {
                                player: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        },
                        nonStrikerScore: {
                            include: {
                                player: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        },
                        bowlerScore: {
                            include: {
                                player: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        },
                        balls: {
                            orderBy: {
                                ballNo: 'asc'
                            }
                        }
                    }
                }
            }
        });

        if (!match) {
            logger.warn(`[/matches] - Match not found for matchId: ${matchId}`);
            return res.status(404).json({
                error: "Match not found"
            });
        }

        logger.info(`[/matches] - Match found for matchId: ${match.sis_id}`);

        return res.status(200).json({
            match
        });
    } catch (error: any) {
        logger.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

interface RequestBody {
    date: Date;
    teams: Array<any>; // Array type annotation
    // or
    // teams: any[]; // Shorthand syntax
}

const addMatch = async (req: Request, res: Response) => {
    try {
        const { date, teams }: RequestBody = req.body;

        // Input validation
        if (!date || !teams.length || teams.length !== 2) {
            logger.warn(`[/matches] - Invalid or missing data in the request body`);
            logger.debug(`[/matches] - date: ${date}, teams: ${teams}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }

        // Calculate the year from the date
        const year = new Date(date).getFullYear().toString();

        // Create the match
        let match = await prisma.cricketMatch.create({
            data: {
                date,
                year,
                teamAId: teams[0].sis_id,
                teamBId: teams[1].sis_id,
                // Create the match first without connecting teams
            }
        });


        const { sis_id: sis_id1 } = await prisma.cricketMatchTeamData.create({
            data: {
                teamId: teams[0].sis_id,
                matchId: match.sis_id,
                name: teams[0].name
            }
        })
        const { sis_id: sis_id2 } = await prisma.cricketMatchTeamData.create({
            data: {
                teamId: teams[1].sis_id,
                matchId: match.sis_id,
                name: teams[1].name
            }
        })
        teams[0].sis_id = sis_id1;
        teams[1].sis_id = sis_id2;

        match = await prisma.cricketMatch.update({
            where: { sis_id: match.sis_id },
            data: {
                teamAScoreId: teams[0].sis_id,
                teamBScoreId: teams[1].sis_id
            },
            include: {
                teamAScore: true,
                teamBScore: true,
            }
        });

        logger.info(`[/matches] - Match added, match ID: ${match.sis_id}`);

        return res.status(200).json({
            match
        });
    } catch (error: any) {
        logger.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

// interface Request extends Request {
//     match?: any
// }

const startMatch = async (req: Request, res: Response) => {
    try {
        if (req.match.played) {
            return res.status(400).json({ error: "Match already started" });
        }

        let match = req.match;

        const { overs, powerPlayOvers, overPerBowler, tossWonByTeamId, tossDecision, strikerId, nonStrikerId, bowlerId } = req.body;

        const [strikerPlayer, nonStrikerPlayer, bowlerPlayer] = await Promise.all([
            prisma.cricketPlayer.findUnique({ where: { sis_id: strikerId } }),
            prisma.cricketPlayer.findUnique({ where: { sis_id: nonStrikerId } }),
            prisma.cricketPlayer.findUnique({ where: { sis_id: bowlerId } })
        ]);

        if (![strikerPlayer, nonStrikerPlayer, bowlerPlayer].every(Boolean)) {
            return res.status(400).json({ error: "Invalid player ID" });
        }

        const createBattingScoresForTeam = async (teamId: string) => {
            const players = await prisma.cricketPlayer.findMany({ where: { teamId, isSelected: true } });
            const battingScores = await Promise.all(players.map(async (player) => {
                return prisma.cricketMatchPlayerBattingScore.create({ data: { matchId: req.match.sis_id, playerId: player.sis_id, teamId } });
            }));
            return battingScores;
        };

        const createBowlingScoresForTeam = async (teamId: string) => {
            const players = await prisma.cricketPlayer.findMany({ where: { teamId, isSelected: true } });
            const bowlingScores = await Promise.all(players.map(async (player) => {
                return prisma.cricketMatchPlayerBowlingScore.create({ data: { matchId: req.match.sis_id, playerId: player.sis_id, teamId } });
            }));
            return bowlingScores;
        };

        const [teamABattersScore, teamABowlersScore, teamBBattersScore, teamBBowlersScore] = await Promise.all([
            createBattingScoresForTeam(req.match.teamAId),
            createBowlingScoresForTeam(req.match.teamAId),
            createBattingScoresForTeam(req.match.teamBId),
            createBowlingScoresForTeam(req.match.teamBId)
        ]);

        const [strikerScore, nonStrikerScore, bowlerScore] = await Promise.all([
            prisma.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId: req.match.sis_id, playerId: strikerId } } }),
            prisma.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId: req.match.sis_id, playerId: nonStrikerId } } }),
            prisma.cricketMatchPlayerBowlingScore.findUnique({ where: { matchId_playerId: { matchId: req.match.sis_id, playerId: bowlerId } } })
        ]);

        if (!strikerScore || !nonStrikerScore || !bowlerScore) {
            return res.status(400).json({ error: "Invalid player ID" });
        }

        await prisma.$transaction([
            prisma.cricketMatchPlayerBattingScore.update({
                where: { matchId_playerId: { matchId: req.match.sis_id, playerId: strikerId } },
                data: { played: true }
            }),
            prisma.cricketMatchPlayerBattingScore.update({
                where: { matchId_playerId: { matchId: req.match.sis_id, playerId: nonStrikerId } },
                data: { played: true }
            }),
            prisma.cricketMatchPlayerBowlingScore.update({
                where: { matchId_playerId: { matchId: req.match.sis_id, playerId: bowlerId } },
                data: { played: true }
            })
        ]);

        const battingTeamScoreId = strikerPlayer?.teamId === req.match.teamAScore.teamId ? req.match.teamAScore.sis_id : req.match.teamBScore.sis_id;
        const bowlingTeamScoreId = bowlerPlayer?.teamId === req.match.teamAScore.teamId ? req.match.teamAScore.sis_id : req.match.teamBScore.sis_id;
        console.log(bowlingTeamScoreId)

        const over = await prisma.cricketOver.create({
            data: { matchId: req.match.sis_id, bowlerScoreId: bowlerScore.sis_id, strikerScoreId: strikerScore.sis_id, nonStrikerScoreId: nonStrikerScore.sis_id, teamScoreId: bowlingTeamScoreId }
        });


        match = await prisma.cricketMatch.update({
            where: { sis_id: req.match.sis_id },
            data: { status: "LIVE", overs, overPerBowler, powerPlayOvers, tossWonBy: tossWonByTeamId, tossDecision, currentOverId: over.sis_id, played: true, teamAScoreId: req.match.teamAScore.sis_id, teamBScoreId: req.match.teamBScore.sis_id, battingTeamScoreId, bowlingTeamScoreId },
            include: { teamAScore: true, teamBScore: true, battingTeamScore: true, bowlingTeamScore: true }
        });

        if (!match.teamAScore?.teamId || !match.teamBScore?.teamId) {
            return res.status(400).json({ error: "Match teams not found" });
        }

        const connectPlayers = async (teamId: string, batters: Array<CricketMatchPlayerBattingScore>, bowlers: Array<CricketMatchPlayerBowlingScore>) => {
            await prisma.cricketMatchTeamData.update({
                where: { teamId_matchId: { teamId, matchId: match.sis_id } },
                data: {
                    batters: { connect: batters.map((player) => ({ sis_id: player.sis_id })) },
                    bowlers: { connect: bowlers.map((player) => ({ sis_id: player.sis_id })) }
                }
            });
        };

        await prisma.cricketMatchTeamData.update({
            where: {
                teamId_matchId: {
                    teamId: match.battingTeamScore.teamId,
                    matchId: match.sis_id
                }
            },
            data: {
                played: true
            }
        })

        await Promise.all([
            connectPlayers(match.teamAScore.teamId, teamABattersScore, teamABowlersScore),
            connectPlayers(match.teamBScore.teamId, teamBBattersScore, teamBBowlersScore),
        ]);

        return res.status(200).json({ match });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const updateMatchToss = async (req: Request, res: Response) => {
    try {
        if (req.match.tossWonBy) {
            logger.warn(`[/matches] - match toss already updated`);
            return res.status(400).json({
                error: "Match toss already updated"
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
            match
        });
    } catch (error: any) {
        logger.error(`[/matches/updateMatchToss] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

// const invalidBallTypes = ["WIDE", "NO_BALL"];

const updateRuns = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;
        const { runs, ballType } = req.body;

        if (!matchId || typeof matchId !== 'string') {
            return res.status(400).json({ error: "Invalid match ID" });
        }
        if (typeof runs !== 'number' || isNaN(runs) || runs < 0) {
            return res.status(400).json({ error: "Invalid runs" });
        }

        let match = req.match;
        // let match = await prisma.cricketMatch.findUnique({
        //     where: { sis_id: matchId },
        //     include: { currentOver: { include: { strikerScore: { include: { player: true } } } }, teamAScore: true, teamBScore: true }
        // });

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
        if (!match.played || !match.currentOver) {
            return res.status(400).json({ error: "Match not started" });
        }
        if (!match.teamAScoreId || !match.teamBScoreId) {
            return res.status(400).json({ error: "Match teams not found" });
        }

        // Prepare the update data
        const updateData = {
            runs: { increment: runs },
            nbRuns: { increment: ballType === "NO_BALL" ? 1 : 0 },
            lbRuns: { increment: ballType === "LEG_BYE" ? runs : 0 },
            byeRuns: { increment: ballType === "BYE" ? runs : 0 },
            wideRuns: { increment: ballType === "WIDE" ? runs : 0 }
        };

        // Update the cricket team match data
        await prisma.cricketMatchTeamData.update({
            where: { sis_id: match.battingTeamScoreId },
            data: updateData
        });

        await prisma.cricketMatchTeamData.update({
            where: { sis_id: match.bowlingTeamScoreId },
            data: {
                balls: { increment: ["NO_BALL", "WIDE"].includes(ballType) ? 0 : 1 },
            }
        })

        let over = await prisma.cricketOver.findFirst({
            where: { sis_id: match.currentOverId || "" },
            include: { strikerScore: { include: { player: true } } }
        });

        over = await prisma.cricketOver.update({
            where: { sis_id: match.currentOver?.sis_id },
            data: {
                totalBalls: { increment: 1 },
                runs: (match.currentOver?.runs || 0) + runs,
                validBalls: { increment: ["NO_BALL", "WIDE"].includes(ballType) ? 0 : 1 }
            },
            include: { strikerScore: { include: { player: true } } }
        });

        await prisma.cricketMatchPlayerBattingScore.update({
            where: { matchId_playerId: { matchId: match.sis_id, playerId: over.strikerScore.playerId || "" } },
            data: {
                played: true,
                balls: { increment: ballType !== "NO_BALL" ? 1 : 0 },
                runs: { increment: ballType !== "NORMAL" ? (ballType === "NO_BALL" ? runs - 1 : 0) : runs },
                sixes: { increment: runs === 6 ? 1 : 0 },
                fours: { increment: runs === 4 ? 1 : 0 }
            }
        });

        await prisma.cricketMatchPlayerBowlingScore.update({
            where: { sis_id: over.bowlerScoreId },
            data: {
                played: true,
                balls: { increment: ["WIDE", "NO_BALL"].includes(ballType) ? 0 : 1 },
                runs: { increment: ["LEG_BYE", "BYE"].includes(ballType) ? 0 : runs },
            }
        })

        const updatedPlayer = await prisma.cricketPlayer.update({
            where: { sis_id: over.strikerScore.playerId },
            data: { runs: { increment: runs }, noOfSixes: { increment: runs === 6 ? 1 : 0 }, noOfFours: { increment: runs === 4 ? 1 : 0 } }
        });

        const ball = await prisma.cricketOverBall.create({
            data: { overId: over.sis_id, ballNo: over.validBalls + 1, runs, ballType }
        });

        if (((runs === 1 || runs === 3) && ballType === "NORMAL") || ((runs === 2 || runs === 4) && ballType !== "NORMAL")) {
            // Update the over in the database with swapped striker and non-striker
            over = await prisma.cricketOver.update({
                where: { sis_id: match.currentOver?.sis_id },
                data: {
                    strikerScoreId: over.nonStrikerScoreId,
                    nonStrikerScoreId: over.strikerScoreId
                },
                include: { strikerScore: { include: { player: true } } }
            });
        }
        if (over.validBalls === 6) {
            // increase over count in bowler if match is over
            await prisma.cricketMatchPlayerBowlingScore.update({
                where: { sis_id: over.bowlerScoreId },
                data: { overs: { increment: 1 } }
            });
            const matchOvers = await prisma.cricketOver.count({
                where: { teamScoreId: match.bowlingTeamScoreId }
            });
            const totalOvers = match.overs;
            console.log(totalOvers, matchOvers);
            if (matchOvers >= totalOvers) {
                if (match.battingTeamScore.played && match.bowlingTeamScore.played) {
                    await prisma.cricketMatch.update({
                        where: { sis_id: match.sis_id },
                        data: { status: "COMPLETED", wonByTeamScoreId: match.bowlingTeamScore.runs > match.battingTeamScore.runs ? match.bowlingTeamScoreId : match.battingTeamScoreId }
                    });
                } else {
                    await prisma.cricketMatch.update({
                        where: { sis_id: match.sis_id },
                        data: { status: "TIMEOUT" }
                    })
                }
            }
        }
        match = await prisma.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: {
                currentOver: {
                    include: {
                        strikerScore: { include: { player: true } },
                        nonStrikerScore: { include: { player: true } },
                        bowlerScore: { include: { player: true } }
                    }
                },
                teamAScore: true,
                teamBScore: true,
                battingTeamScore: true,
                bowlingTeamScore: true
            }
        });

        return res.status(200).json({ match, over: over, striker: updatedPlayer, ball });
    } catch (error: any) {
        logger.error(`[/matches/updateMatchScore] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateWickets = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;
        const { wicketType, upcomingBatsmanId, eliminatedPlayerId } = req.body;

        if (!matchId || typeof matchId !== 'string') {
            return res.status(400).json({ error: "Invalid match ID" });
        }
        if (!wicketType || typeof wicketType !== 'string') {
            return res.status(400).json({ error: "Invalid wicket type" });
        }

        let match = await prisma.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: {
                currentOver: {
                    include: {
                        strikerScore: { include: { player: true } },
                        nonStrikerScore: { include: { player: true } },
                        bowlerScore: { include: { player: true } }
                    }
                },
                teamAScore: true,
                teamBScore: true,
                battingTeamScore: true,
                bowlingTeamScore: true
            }
        });

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
        if (!match.played || !match.currentOver) {
            return res.status(400).json({ error: "Match not started" });
        }
        if (!match.teamAScoreId || !match.teamBScoreId) {
            return res.status(400).json({ error: "Match teams not found" });
        }

        const battingTeam = match.teamAScore?.teamId === match.currentOver.strikerScore.teamId ? match.teamAScore.teamId : match.teamBScore?.teamId || "";

        const cricketMatchTeamData = await prisma.cricketMatchTeamData.update({
            where: { sis_id: match.battingTeamScoreId },
            data: { wickets: { increment: 1 } }
        });

        await prisma.cricketMatchTeamData.update({
            where: { sis_id: match.bowlingTeamScoreId },
            data: {
                balls: { increment: 1 }
            }
        })

        if (cricketMatchTeamData.wickets === 10) {
            return res.status(200).json({ message: "Match has been ended or all players have been eliminated from the team, no more players can be eliminated" });
        }

        const validatePlayer = async (playerId: string) => {
            const player = await prisma.cricketPlayer.findUnique({ where: { sis_id: playerId } });
            return player && player.teamId === battingTeam;
        };

        if (!(await validatePlayer(upcomingBatsmanId))) {
            return res.status(400).json({ error: "Invalid next striker player ID" });
        }
        if (!(await validatePlayer(eliminatedPlayerId))) {
            return res.status(400).json({ error: "Invalid eliminated player ID" });
        }

        await prisma.cricketMatchPlayerBattingScore.update({
            where: { matchId_playerId: { matchId: match.sis_id, playerId: eliminatedPlayerId } },
            data: { out: true, wicketType, played: true, balls: { increment: 1 } }
        });

        await prisma.cricketMatchPlayerBowlingScore.update({
            where: { matchId_playerId: { matchId: match.sis_id, playerId: match.currentOver.bowlerScore.playerId || "" } },
            data: {
                played: true,
                wickets: { increment: 1 },
                balls: { increment: 1 }
            }
        });

        const upcomingBatsmanMatchScore = await prisma.cricketMatchPlayerBattingScore.findUnique({
            where: { matchId_playerId: { matchId: match.sis_id, playerId: upcomingBatsmanId } }
        });

        if (!upcomingBatsmanMatchScore || upcomingBatsmanMatchScore.teamId !== battingTeam) {
            return res.status(400).json({ error: "Invalid upcoming batsman player ID" });
        }

        let updatedOver = await prisma.cricketOver.update({
            where: { sis_id: match.currentOver.sis_id },
            data: {
                wickets: { increment: 1 },
                totalBalls: { increment: 1 },
                validBalls: { increment: 1 },
                strikerScoreId: eliminatedPlayerId === match.currentOver.strikerScore.playerId ? upcomingBatsmanMatchScore.sis_id : match.currentOver.strikerScoreId,
                nonStrikerScoreId: eliminatedPlayerId === match.currentOver.nonStrikerScore.playerId ? upcomingBatsmanMatchScore.sis_id : match.currentOver.nonStrikerScoreId
            },
            include: { strikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } } }
        });

        const updatedBowler = await prisma.cricketPlayer.update({
            where: { sis_id: (updatedOver?.bowlerScore?.playerId || "") as string },
            data: { noOfWickets: { increment: 1 } }
        });

        await prisma.cricketOverBall.create({
            data: { overId: updatedOver.sis_id, ballNo: updatedOver.validBalls + 1, wicket: true, wicketType, runs: 0 }
        });

        const selectedBattersCount = await prisma.cricketMatchPlayerBattingScore.count({
            where: { matchId: match.sis_id }
        });
        if (cricketMatchTeamData.wickets >= selectedBattersCount) {
            await prisma.cricketMatch.update({
                where: { sis_id: match.sis_id },
                data: { status: "TIMEOUT", wonByTeamScoreId: match.bowlingTeamScore.runs > match.battingTeamScore.runs ? match.bowlingTeamScoreId : match.battingTeamScoreId }
            });
            return res.status(200).json({ message: "Match has been ended or all players have been eliminated from the team, no more players can be eliminated" });
        }

        if (updatedOver.validBalls === 6) {
            // Check if all overs are completed
            const matchOvers = await prisma.cricketOver.count({
                where: { teamScoreId: match.bowlingTeamScoreId }
            });

            const totalOvers = match.overs;
            console.log(totalOvers, matchOvers);

            if (matchOvers >= totalOvers) {
                if (match.battingTeamScore.played && match.bowlingTeamScore.played) {
                    await prisma.cricketMatch.update({
                        where: { sis_id: match.sis_id },
                        data: { status: "COMPLETED", wonByTeamScoreId: match.bowlingTeamScore.runs > match.battingTeamScore.runs ? match.bowlingTeamScoreId : match.battingTeamScoreId }
                    });
                    return res.status(200).json({ message: "Match has ended, all overs are completed" });
                }
                else {
                    await prisma.cricketMatch.update({
                        where: { sis_id: match.sis_id },
                        data: { status: "TIMEOUT" }
                    });
                    return res.status(200).json({ message: "Bowling team will now bat" });
                }
            }

            updatedOver = await prisma.cricketOver.create({
                data: {
                    matchId: match.sis_id,
                    bowlerScoreId: updatedOver.bowlerScoreId,
                    strikerScoreId: updatedOver.nonStrikerScoreId,
                    nonStrikerScoreId: updatedOver.strikerScoreId,
                    teamScoreId: match.bowlingTeamScoreId
                },
                include: { strikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } } }
            });
            await prisma.cricketMatch.update({
                where: { sis_id: match.sis_id },
                data: { currentOverId: updatedOver.sis_id }
            });
        }
        match = await prisma.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: {
                currentOver: {
                    include: {
                        strikerScore: { include: { player: true } },
                        nonStrikerScore: { include: { player: true } },
                        bowlerScore: { include: { player: true } }
                    }
                },
                teamAScore: true,
                teamBScore: true,
                battingTeamScore: true,
                bowlingTeamScore: true
            }
        });

        return res.status(200).json({ match, over: updatedOver, striker: updatedBowler });
    } catch (error: any) {
        logger.error(`[/matches/updateMatchScore] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getOver = async (req: Request, res: Response) => {
    try {
        const { overId } = req.params;

        if (!overId || typeof overId !== 'string') {
            logger.warn(`[/matches] - Invalid overId: ${overId}`);
            return res.status(400).json({ error: "Invalid over ID" });
        }

        const over = await prisma.cricketOver.findUnique({
            where: { sis_id: overId },
            include: { strikerScore: { include: { player: true } }, nonStrikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } }, balls: { orderBy: { ballNo: 'asc' } } },
        });

        if (!over) {
            logger.warn(`[/matches] - Over not found for overId: ${overId}`);
            return res.status(404).json({ error: "Over not found" });
        }

        return res.status(200).json({ over });
    } catch (error: any) {
        logger.error(`[/matches] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const updateBowler = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;
        const { bowlerId, newOver = true } = req.body;

        if (!matchId || typeof matchId !== 'string') {
            return res.status(400).json({ error: "Invalid match ID" });
        }
        if (!bowlerId || typeof bowlerId !== 'string') {
            return res.status(400).json({ error: "Invalid bowler ID" });
        }

        const match = await prisma.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: { currentOver: { include: { strikerScore: { include: { player: true } } } }, teamAScore: true, teamBScore: true }
        });

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
        if (!match.played || !match.currentOver) {
            return res.status(400).json({ error: "Match not started" });
        }
        if (!match.teamAScoreId || !match.teamBScoreId) {
            return res.status(400).json({ error: "Match teams not found" });
        }

        const battingTeam = match.teamAScore?.teamId === match.currentOver.strikerScore.teamId ? match.teamAScoreId : match.teamBScoreId;

        const bowler = await prisma.cricketPlayer.findUnique({ where: { sis_id: bowlerId } });
        if (!bowler || bowler.teamId !== battingTeam) {
            return res.status(400).json({ error: "Invalid bowler ID" });
        }
        if (newOver) {
            const over = await prisma.cricketOver.create({
                data: { matchId: match.sis_id, bowlerScoreId: bowlerId, strikerScoreId: match.currentOver.strikerScoreId, nonStrikerScoreId: match.currentOver.nonStrikerScoreId, teamScoreId: match.bowlingTeamScoreId },
                include: { strikerScore: { include: { player: true } }, nonStrikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } }, balls: { orderBy: { ballNo: 'asc' } } },
            });
            return res.status(200).json({ over });
        }

        const over = await prisma.cricketOver.update({
            where: { sis_id: match.currentOver.sis_id },
            data: { bowlerScoreId: bowlerId },
            include: { strikerScore: { include: { player: true } }, nonStrikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } }, balls: { orderBy: { ballNo: 'asc' } } },
        });

        return res.status(200).json({ over });
    } catch (error: any) {
        logger.error(`[/matches/updateBowler] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const createOver = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;
        const { strikerId, nonStrikerId, bowlerId } = req.body;
        console.log(matchId, strikerId, nonStrikerId, bowlerId)

        if (!matchId || typeof matchId !== 'string') {
            return res.status(400).json({ error: "Invalid match ID" });
        }

        const match = await prisma.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: { teamAScore: true, teamBScore: true, currentOver: { include: { strikerScore: true } } }
        });

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
        if (!match.played || !match.teamAScoreId || !match.teamBScoreId) {
            return res.status(400).json({ error: "Match not started or teams not found" });
        }

        // const battingTeam = match.teamAScore?.teamId === match.currentOver?.strikerScore?.teamId ? match.teamAScoreId : match.teamBScoreId;

        const validatePlayer = async (playerId: string) => {
            const player = await prisma.cricketPlayer.findUnique({ where: { sis_id: playerId } });
            return player;
        };

        if (!(await validatePlayer(strikerId)) || !(await validatePlayer(nonStrikerId)) || !(await validatePlayer(bowlerId))) {
            return res.status(400).json({ error: "Invalid player ID(s)" });
        }

        const [strikerScoreId, nonStrikerScoreId, bowlerScoreId] = await Promise.all([
            prisma.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId, playerId: strikerId } }, select: { sis_id: true } }),
            prisma.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId, playerId: nonStrikerId } }, select: { sis_id: true } }),
            prisma.cricketMatchPlayerBowlingScore.findUnique({ where: { matchId_playerId: { matchId, playerId: bowlerId } }, select: { sis_id: true } })
        ]);

        const over = await prisma.cricketOver.create({
            data: { matchId, strikerScoreId: strikerScoreId.sis_id, nonStrikerScoreId: nonStrikerScoreId.sis_id, bowlerScoreId: bowlerScoreId.sis_id, teamScoreId: match.bowlingTeamScoreId }
        });

        await prisma.cricketMatch.update({
            where: { sis_id: matchId },
            data: { currentOverId: over.sis_id }
        });

        return res.status(200).json({ over });
    } catch (error: any) {
        logger.error(`[/matches/createOver] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const startSecondInning = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;

        const match = req.match;

        const { strikerId, nonStrikerId, bowlerId } = req.body;
        const [strikerScore, nonStrikerScore, bowlerScore] = await Promise.all([
            prisma.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId, playerId: strikerId } } }),
            prisma.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId, playerId: nonStrikerId } } }),
            prisma.cricketMatchPlayerBowlingScore.findUnique({ where: { matchId_playerId: { matchId, playerId: bowlerId } } })
        ]);

        if (!strikerScore || !nonStrikerScore || !bowlerScore) {
            return res.status(400).json({ error: "Invalid player ID" });
        }

        if (!match.played || !match.teamAScoreId || !match.teamBScoreId) {
            return res.status(400).json({ error: "Match not started or teams not found" });
        }

        // check if new bowler's team id is same as old inning's bowling team id
        if (bowlerScore.teamId === match.bowlingTeamScore.teamId) {
            return res.status(400).json({ error: "Invalid bowler ID" });
        }

        // check if striker and non striker are from old inning's batting team
        if (strikerScore.teamId === match.battingTeamScore.teamId || nonStrikerScore.teamId === match.battingTeamScore.teamId) {
            return res.status(400).json({ error: "Invalid striker or non striker ID" });
        }

        const over = await prisma.cricketOver.create({
            data: {
                matchId,
                strikerScoreId: strikerScore.sis_id,
                nonStrikerScoreId: nonStrikerScore.sis_id,
                bowlerScoreId: bowlerScore.sis_id,
                teamScoreId: match.battingTeamScoreId
            }
        });

        const updatedMatch = await prisma.cricketMatch.update({
            where: { sis_id: matchId },
            data: { status: "LIVE", currentOverId: over.sis_id, battingTeamScoreId: match.bowlingTeamScoreId, bowlingTeamScoreId: match.battingTeamScoreId },
            include: {
                battingTeamScore: true,
                bowlingTeamScore: true
            }
        });

        await prisma.cricketMatchTeamData.update({
            where: {
                teamId_matchId: {
                    teamId: updatedMatch.battingTeamScore.teamId,
                    matchId: matchId
                }
            },
            data: {
                played: true
            }
        })

        return res.status(200).json({ over });
    }
    catch (error: any) {
        console.log(error)
        logger.error(`[/matches/startNextInning] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const deleteLastBall = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;

        const match = req.match;

        const over = await prisma.cricketOver.findFirst({
            where: { matchId: matchId, totalBalls: { gt: 0 }, teamScoreId: match.bowlingTeamScoreId },
            orderBy: { totalBalls: 'desc' },
            include: { balls: { orderBy: { ballNo: 'asc' } } }
        });

        if (!over) {
            return res.status(404).json({ error: "Over not found" });
        }

        const lastBall = over.balls.pop();
        if (!lastBall) {
            return res.status(404).json({ error: "Ball not found" });
        }

        const updatedOver = await prisma.cricketOver.update({
            where: { sis_id: over.sis_id },
            data: {
                totalBalls: { decrement: 1 },
                runs: { decrement: lastBall.runs },
                validBalls: { decrement: 1 }
            },
            include: { strikerScore: { include: { player: true } } }
        });

        await prisma.cricketMatchTeamData.update({
            where: { sis_id: match.battingTeamScoreId },
            data: {
                runs: { decrement: lastBall.runs },
                balls: { decrement: 1 }
            }
        });

        await prisma.cricketMatchPlayerBattingScore.update({
            where: { matchId_playerId: { matchId: match.sis_id, playerId: updatedOver.strikerScore.playerId || "" } },
            data: {
                runs: { decrement: lastBall.runs },
                balls: { decrement: 1 },
                sixes: { decrement: lastBall.runs === 6 ? 1 : 0 },
                fours: { decrement: lastBall.runs === 4 ? 1 : 0 }
            }
        });

        await prisma.cricketMatchPlayerBowlingScore.update({
            where: { sis_id: updatedOver.bowlerScoreId },
            data: {
                runs: { decrement: lastBall.runs },
                balls: { decrement: 1 }
            }
        });

        await prisma.cricketOverBall.delete({
            where: { sis_id: lastBall.sis_id }
        });

        return res.status(200).json({ match, over: updatedOver, ball: lastBall });

    }
    catch (error: any) {
        logger.error(`[/matches/deleteLastBall] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export default { getMatches, addMatch, startMatch, updateMatchToss, getMatch, updateRuns, updateWickets, getOver, updateBowler, createOver, startSecondInning, deleteLastBall }