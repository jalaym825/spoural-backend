"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logger"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getMatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year } = req.params;
        // Input validation
        if (!year || !/^\d{4}$/.test(year)) {
            logger_1.default.warn(`[/matches] - Invalid year parameter: ${year}`);
            return res.status(400).json({
                error: "Invalid year parameter"
            });
        }
        const matches = yield prisma_1.default.cricketMatch.findMany({
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
                wonByTeam: true
            }
        });
        logger_1.default.info(`[/matches] - ${matches.length} matches found for year ${year}`);
        return res.status(200).json({
            matches
        });
    }
    catch (error) {
        logger_1.default.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});
const getMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matchId } = req.params;
        // Input validation
        if (!matchId) {
            logger_1.default.warn(`[/matches] - Invalid or missing matchId parameter`);
            return res.status(400).json({
                error: "Invalid match id"
            });
        }
        const match = yield prisma_1.default.cricketMatch.findUnique({
            where: {
                sis_id: matchId
            },
            include: {
                battingTeam: {
                    include: {
                        team: true
                    }
                },
                bowlingTeam: {
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
                wonByTeam: true,
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
            logger_1.default.warn(`[/matches] - Match not found for matchId: ${matchId}`);
            return res.status(404).json({
                error: "Match not found"
            });
        }
        logger_1.default.info(`[/matches] - Match found for matchId: ${match.sis_id}`);
        return res.status(200).json({
            match
        });
    }
    catch (error) {
        logger_1.default.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});
const addMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, teams } = req.body;
        // Input validation
        if (!date || !teams.length || teams.length !== 2) {
            logger_1.default.warn(`[/matches] - Invalid or missing data in the request body`);
            logger_1.default.debug(`[/matches] - date: ${date}, teams: ${teams}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        // Calculate the year from the date
        const year = new Date(date).getFullYear().toString();
        // Create the match
        let match = yield prisma_1.default.cricketMatch.create({
            data: {
                date,
                year,
                teamAId: teams[0].sis_id,
                teamBId: teams[1].sis_id,
                // Create the match first without connecting teams
            }
        });
        const { sis_id: sis_id1 } = yield prisma_1.default.cricketTeamMatchData.create({
            data: {
                teamId: teams[0].sis_id,
                matchId: match.sis_id,
                name: teams[0].name
            }
        });
        const { sis_id: sis_id2 } = yield prisma_1.default.cricketTeamMatchData.create({
            data: {
                teamId: teams[1].sis_id,
                matchId: match.sis_id,
                name: teams[1].name
            }
        });
        teams[0].sis_id = sis_id1;
        teams[1].sis_id = sis_id2;
        match = yield prisma_1.default.cricketMatch.update({
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
        logger_1.default.info(`[/matches] - Match added, match ID: ${match.sis_id}`);
        return res.status(200).json({
            match
        });
    }
    catch (error) {
        logger_1.default.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});
const startMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (req.match.played) {
            return res.status(400).json({ error: "Match already started" });
        }
        const { overs, powerPlayOvers, overPerBowler, tossWonByTeamId, tossDecision, strikerId, nonStrikerId, bowlerId } = req.body;
        const [strikerPlayer, nonStrikerPlayer, bowlerPlayer] = yield Promise.all([
            prisma_1.default.cricketPlayer.findUnique({ where: { sis_id: strikerId } }),
            prisma_1.default.cricketPlayer.findUnique({ where: { sis_id: nonStrikerId } }),
            prisma_1.default.cricketPlayer.findUnique({ where: { sis_id: bowlerId } })
        ]);
        if (![strikerPlayer, nonStrikerPlayer, bowlerPlayer].every(Boolean)) {
            return res.status(400).json({ error: "Invalid player ID" });
        }
        const createBattingScoresForTeam = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
            const players = yield prisma_1.default.cricketPlayer.findMany({ where: { teamId, isSelected: true } });
            const battingScores = yield Promise.all(players.map((player) => __awaiter(void 0, void 0, void 0, function* () {
                return prisma_1.default.cricketMatchPlayerBattingScore.create({ data: { matchId: req.match.sis_id, playerId: player.sis_id, teamId } });
            })));
            return battingScores;
        });
        const createBowlingScoresForTeam = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
            const players = yield prisma_1.default.cricketPlayer.findMany({ where: { teamId, isSelected: true } });
            const bowlingScores = yield Promise.all(players.map((player) => __awaiter(void 0, void 0, void 0, function* () {
                return prisma_1.default.cricketMatchPlayerBowlingScore.create({ data: { matchId: req.match.sis_id, playerId: player.sis_id, teamId } });
            })));
            return bowlingScores;
        });
        const [teamABattersScore, teamABowlersScore, teamBBattersScore, teamBBowlersScore] = yield Promise.all([
            createBattingScoresForTeam(req.match.teamAId),
            createBowlingScoresForTeam(req.match.teamAId),
            createBattingScoresForTeam(req.match.teamBId),
            createBowlingScoresForTeam(req.match.teamBId)
        ]);
        const [strikerScore, nonStrikerScore, bowlerScore] = yield Promise.all([
            prisma_1.default.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId: req.match.sis_id, playerId: strikerId } } }),
            prisma_1.default.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId: req.match.sis_id, playerId: nonStrikerId } } }),
            prisma_1.default.cricketMatchPlayerBowlingScore.findUnique({ where: { matchId_playerId: { matchId: req.match.sis_id, playerId: bowlerId } } })
        ]);
        if (!strikerScore || !nonStrikerScore || !bowlerScore) {
            return res.status(400).json({ error: "Invalid player ID" });
        }
        yield prisma_1.default.$transaction([
            prisma_1.default.cricketMatchPlayerBattingScore.update({
                where: { matchId_playerId: { matchId: req.match.sis_id, playerId: strikerId } },
                data: { played: true }
            }),
            prisma_1.default.cricketMatchPlayerBattingScore.update({
                where: { matchId_playerId: { matchId: req.match.sis_id, playerId: nonStrikerId } },
                data: { played: true }
            }),
            prisma_1.default.cricketMatchPlayerBowlingScore.update({
                where: { matchId_playerId: { matchId: req.match.sis_id, playerId: bowlerId } },
                data: { played: true }
            })
        ]);
        const over = yield prisma_1.default.cricketOver.create({
            data: { matchId: req.match.sis_id, bowlerScoreId: (bowlerScore === null || bowlerScore === void 0 ? void 0 : bowlerScore.sis_id) || "", strikerScoreId: (strikerScore === null || strikerScore === void 0 ? void 0 : strikerScore.sis_id) || "", nonStrikerScoreId: (nonStrikerScore === null || nonStrikerScore === void 0 ? void 0 : nonStrikerScore.sis_id) || "" }
        });
        const battingTeamScoreId = (strikerPlayer === null || strikerPlayer === void 0 ? void 0 : strikerPlayer.teamId) === req.match.teamAScore.teamId ? req.match.teamAScore.sis_id : req.match.teamBScore.sis_id;
        const bowlingTeamScoreId = (bowlerPlayer === null || bowlerPlayer === void 0 ? void 0 : bowlerPlayer.teamId) === req.match.teamAScore.teamId ? req.match.teamAScore.sis_id : req.match.teamBScore.sis_id;
        const match = yield prisma_1.default.cricketMatch.update({
            where: { sis_id: req.match.sis_id },
            data: { overs, overPerBowler, powerPlayOvers, tossWonBy: tossWonByTeamId, tossDecision, currentOverId: over.sis_id, played: true, teamAScoreId: req.match.teamAScore.sis_id, teamBScoreId: req.match.teamBScore.sis_id, battingTeamScoreId, bowlingTeamScoreId },
            include: { teamAScore: true, teamBScore: true }
        });
        if (!((_a = match.teamAScore) === null || _a === void 0 ? void 0 : _a.teamId) || !((_b = match.teamBScore) === null || _b === void 0 ? void 0 : _b.teamId)) {
            return res.status(400).json({ error: "Match teams not found" });
        }
        const connectPlayers = (teamId, batters, bowlers) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma_1.default.cricketTeamMatchData.update({
                where: { teamId_matchId: { teamId, matchId: match.sis_id } },
                data: {
                    batters: { connect: batters.map((player) => ({ sis_id: player.sis_id })) },
                    bowlers: { connect: bowlers.map((player) => ({ sis_id: player.sis_id })) }
                }
            });
        });
        yield Promise.all([
            connectPlayers(match.teamAScore.teamId, teamABattersScore, teamABowlersScore),
            connectPlayers(match.teamBScore.teamId, teamBBattersScore, teamBBowlersScore),
        ]);
        return res.status(200).json({ match });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
const updateMatchToss = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.match.tossWonBy) {
            logger_1.default.warn(`[/matches] - match toss already updated`);
            return res.status(400).json({
                error: "Match toss already updated"
            });
        }
        const { tossWonBy } = req.body;
        const match = yield prisma_1.default.cricketMatch.update({
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
        logger_1.default.info(`[/matches/updateMatchToss] - match toss updated, match: ${match.sis_id}`);
        return res.status(200).json({
            match
        });
    }
    catch (error) {
        logger_1.default.error(`[/matches/updateMatchToss] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
// const invalidBallTypes = ["WIDE", "NO_BALL"];
const updateRuns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    try {
        const { matchId } = req.params;
        const { runs, ballType } = req.body;
        if (!matchId || typeof matchId !== 'string') {
            return res.status(400).json({ error: "Invalid match ID" });
        }
        if (typeof runs !== 'number' || isNaN(runs) || runs < 0) {
            return res.status(400).json({ error: "Invalid runs" });
        }
        let match = yield prisma_1.default.cricketMatch.findUnique({
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
        const battingTeam = ((_c = match.teamAScore) === null || _c === void 0 ? void 0 : _c.teamId) === match.currentOver.strikerScore.teamId ? match.teamAScoreId : match.teamBScoreId;
        // Prepare the update data
        const updateData = {
            runs: { increment: runs },
            balls: { increment: ["NO_BALL", "WIDE"].includes(ballType) ? 0 : 1 },
            nbRuns: { increment: ballType === "NO_BALL" ? 1 : 0 },
            lbRuns: { increment: ballType === "LEG_BYE" ? runs : 0 },
            byeRuns: { increment: ballType === "BYE" ? runs : 0 },
            wideRuns: { increment: ballType === "WIDE" ? runs : 0 }
        };
        // Update the cricket team match data
        yield prisma_1.default.cricketTeamMatchData.update({
            where: { sis_id: battingTeam },
            data: updateData
        });
        let over = yield prisma_1.default.cricketOver.findFirst({
            where: { sis_id: match.currentOverId || "" },
            include: { strikerScore: { include: { player: true } } }
        });
        over = yield prisma_1.default.cricketOver.update({
            where: { sis_id: (_d = match.currentOver) === null || _d === void 0 ? void 0 : _d.sis_id },
            data: {
                totalBalls: { increment: 1 },
                runs: (((_e = match.currentOver) === null || _e === void 0 ? void 0 : _e.runs) || 0) + runs,
                validBalls: { increment: ["NO_BALL", "WIDE"].includes(ballType) ? 0 : 1 }
            },
            include: { strikerScore: { include: { player: true } } }
        });
        yield prisma_1.default.cricketMatchPlayerBattingScore.update({
            where: { matchId_playerId: { matchId: match.sis_id, playerId: over.strikerScore.playerId || "" } },
            data: {
                played: true,
                balls: { increment: ballType !== "NO_BALL" ? 1 : 0 },
                runs: { increment: ballType !== "NORMAL" ? (ballType === "NO_BALL" ? runs - 1 : 0) : runs },
                sixes: { increment: runs === 6 ? 1 : 0 },
                fours: { increment: runs === 4 ? 1 : 0 }
            }
        });
        yield prisma_1.default.cricketMatchPlayerBowlingScore.update({
            where: { sis_id: over.bowlerScoreId },
            data: {
                played: true,
                balls: { increment: ["WIDE", "NO_BALL"].includes(ballType) ? 0 : 1 },
                runs: { increment: ["LEG_BYE", "BYE"].includes(ballType) ? 0 : runs }
            }
        });
        const updatedPlayer = yield prisma_1.default.cricketPlayer.update({
            where: { sis_id: over.strikerScore.playerId || "" },
            data: { runs: { increment: runs }, noOfSixes: { increment: runs === 6 ? 1 : 0 }, noOfFours: { increment: runs === 4 ? 1 : 0 } }
        });
        const ball = yield prisma_1.default.cricketOverBall.create({
            data: { overId: over.sis_id, ballNo: over.validBalls + 1, runs, ballType }
        });
        if (((runs === 1 || runs === 3) && ballType === "NORMAL") || ((runs === 2 || runs === 4) && ballType !== "NORMAL")) {
            // Update the over in the database with swapped striker and non-striker
            over = yield prisma_1.default.cricketOver.update({
                where: { sis_id: (_f = match.currentOver) === null || _f === void 0 ? void 0 : _f.sis_id },
                data: {
                    strikerScoreId: over.nonStrikerScoreId,
                    nonStrikerScoreId: over.strikerScoreId
                },
                include: { strikerScore: { include: { player: true } } }
            });
        }
        return res.status(200).json({ match, over: over, striker: updatedPlayer, ball });
    }
    catch (error) {
        logger_1.default.error(`[/matches/updateMatchScore] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
});
const updateWickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j;
    try {
        const { matchId } = req.params;
        const { wicketType, upcomingBatsmanId, eliminatedPlayerId } = req.body;
        if (!matchId || typeof matchId !== 'string') {
            return res.status(400).json({ error: "Invalid match ID" });
        }
        if (!wicketType || typeof wicketType !== 'string') {
            return res.status(400).json({ error: "Invalid wicket type" });
        }
        const match = yield prisma_1.default.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: { currentOver: { include: { strikerScore: { include: { player: true } }, nonStrikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } } } }, teamAScore: true, teamBScore: true }
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
        const battingTeam = ((_g = match.teamAScore) === null || _g === void 0 ? void 0 : _g.teamId) === match.currentOver.strikerScore.teamId ? match.teamAScore.teamId : ((_h = match.teamBScore) === null || _h === void 0 ? void 0 : _h.teamId) || "";
        const cricketMatchTeamData = yield prisma_1.default.cricketTeamMatchData.update({
            where: { teamId_matchId: { teamId: battingTeam, matchId: match.sis_id } },
            data: { wickets: { increment: 1 }, balls: { increment: 1 } }
        });
        const selectedTeamPlayers = yield prisma_1.default.cricketPlayer.count({
            where: {
                teamId: battingTeam
            },
        });
        if (cricketMatchTeamData.wickets === selectedTeamPlayers) {
            return res.status(200).json({ message: "Match has been ended or all players have been eliminated from the team, no more players can be eliminated" });
        }
        const validatePlayer = (playerId) => __awaiter(void 0, void 0, void 0, function* () {
            const player = yield prisma_1.default.cricketPlayer.findUnique({ where: { sis_id: playerId } });
            return player && player.teamId === battingTeam;
        });
        if (!(yield validatePlayer(upcomingBatsmanId))) {
            return res.status(400).json({ error: "Invalid next striker player ID" });
        }
        if (!(yield validatePlayer(eliminatedPlayerId))) {
            return res.status(400).json({ error: "Invalid eliminated player ID" });
        }
        yield prisma_1.default.cricketMatchPlayerBattingScore.update({
            where: { matchId_playerId: { matchId: match.sis_id, playerId: eliminatedPlayerId } },
            data: { out: true, wicketType, played: true, balls: { increment: 1 } }
        });
        yield prisma_1.default.cricketMatchPlayerBowlingScore.update({
            where: { matchId_playerId: { matchId: match.sis_id, playerId: match.currentOver.bowlerScore.playerId || "" } },
            data: {
                played: true,
                wickets: { increment: 1 },
                balls: { increment: 1 }
            }
        });
        const upcomingBatsmanMatchScore = yield prisma_1.default.cricketMatchPlayerBattingScore.findUnique({
            where: { matchId_playerId: { matchId: match.sis_id, playerId: upcomingBatsmanId } }
        });
        if (!upcomingBatsmanMatchScore || upcomingBatsmanMatchScore.teamId !== battingTeam) {
            return res.status(400).json({ error: "Invalid upcoming batsman player ID" });
        }
        let updatedOver = yield prisma_1.default.cricketOver.update({
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
        const updatedBowler = yield prisma_1.default.cricketPlayer.update({
            where: { sis_id: (((_j = updatedOver === null || updatedOver === void 0 ? void 0 : updatedOver.bowlerScore) === null || _j === void 0 ? void 0 : _j.playerId) || "") },
            data: { noOfWickets: { increment: 1 } }
        });
        yield prisma_1.default.cricketOverBall.create({
            data: { overId: updatedOver.sis_id, ballNo: updatedOver.validBalls + 1, wicket: true, wicketType, runs: 0 }
        });
        if (updatedOver.validBalls === 6) {
            updatedOver = yield prisma_1.default.cricketOver.create({
                data: {
                    matchId: match.sis_id,
                    bowlerScoreId: updatedOver.bowlerScoreId,
                    strikerScoreId: updatedOver.nonStrikerScoreId,
                    nonStrikerScoreId: updatedOver.strikerScoreId
                },
                include: { strikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } } }
            });
            yield prisma_1.default.cricketMatch.update({
                where: { sis_id: match.sis_id },
                data: { currentOverId: updatedOver.sis_id }
            });
        }
        return res.status(200).json({ match, over: updatedOver, striker: updatedBowler });
    }
    catch (error) {
        logger_1.default.error(`[/matches/updateMatchScore] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
});
const getOver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { overId } = req.params;
        if (!overId || typeof overId !== 'string') {
            logger_1.default.warn(`[/matches] - Invalid overId: ${overId}`);
            return res.status(400).json({ error: "Invalid over ID" });
        }
        const over = yield prisma_1.default.cricketOver.findUnique({
            where: { sis_id: overId },
            include: { strikerScore: { include: { player: true } }, nonStrikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } }, balls: { orderBy: { ballNo: 'asc' } } },
        });
        if (!over) {
            logger_1.default.warn(`[/matches] - Over not found for overId: ${overId}`);
            return res.status(404).json({ error: "Over not found" });
        }
        return res.status(200).json({ over });
    }
    catch (error) {
        logger_1.default.error(`[/matches] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
});
const updateBowler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    try {
        const { matchId } = req.params;
        const { bowlerId, newOver = true } = req.body;
        if (!matchId || typeof matchId !== 'string') {
            return res.status(400).json({ error: "Invalid match ID" });
        }
        if (!bowlerId || typeof bowlerId !== 'string') {
            return res.status(400).json({ error: "Invalid bowler ID" });
        }
        const match = yield prisma_1.default.cricketMatch.findUnique({
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
        const battingTeam = ((_k = match.teamAScore) === null || _k === void 0 ? void 0 : _k.teamId) === match.currentOver.strikerScore.teamId ? match.teamAScoreId : match.teamBScoreId;
        const bowler = yield prisma_1.default.cricketPlayer.findUnique({ where: { sis_id: bowlerId } });
        if (!bowler || bowler.teamId !== battingTeam) {
            return res.status(400).json({ error: "Invalid bowler ID" });
        }
        if (newOver) {
            const over = yield prisma_1.default.cricketOver.create({
                data: { matchId: match.sis_id, bowlerScoreId: bowlerId, strikerScoreId: match.currentOver.strikerScoreId, nonStrikerScoreId: match.currentOver.nonStrikerScoreId },
                include: { strikerScore: { include: { player: true } }, nonStrikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } }, balls: { orderBy: { ballNo: 'asc' } } },
            });
            return res.status(200).json({ over });
        }
        const over = yield prisma_1.default.cricketOver.update({
            where: { sis_id: match.currentOver.sis_id },
            data: { bowlerScoreId: bowlerId },
            include: { strikerScore: { include: { player: true } }, nonStrikerScore: { include: { player: true } }, bowlerScore: { include: { player: true } }, balls: { orderBy: { ballNo: 'asc' } } },
        });
        return res.status(200).json({ over });
    }
    catch (error) {
        logger_1.default.error(`[/matches/updateBowler] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
});
const createOver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matchId } = req.params;
        const { strikerId, nonStrikerId, bowlerId } = req.body;
        if (!matchId || typeof matchId !== 'string') {
            return res.status(400).json({ error: "Invalid match ID" });
        }
        const match = yield prisma_1.default.cricketMatch.findUnique({
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
        const validatePlayer = (playerId) => __awaiter(void 0, void 0, void 0, function* () {
            const player = yield prisma_1.default.cricketPlayer.findUnique({ where: { sis_id: playerId } });
            return player;
        });
        if (!(yield validatePlayer(strikerId)) || !(yield validatePlayer(nonStrikerId)) || !(yield validatePlayer(bowlerId))) {
            return res.status(400).json({ error: "Invalid player ID(s)" });
        }
        const [strikerScoreId, nonStrikerScoreId, bowlerScoreId] = yield Promise.all([
            prisma_1.default.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId, playerId: strikerId } }, select: { sis_id: true } }),
            prisma_1.default.cricketMatchPlayerBattingScore.findUnique({ where: { matchId_playerId: { matchId, playerId: nonStrikerId } }, select: { sis_id: true } }),
            prisma_1.default.cricketMatchPlayerBowlingScore.findUnique({ where: { matchId_playerId: { matchId, playerId: bowlerId } }, select: { sis_id: true } })
        ]);
        const over = yield prisma_1.default.cricketOver.create({
            data: { matchId, strikerScoreId: strikerScoreId.sis_id, nonStrikerScoreId: nonStrikerScoreId.sis_id, bowlerScoreId: bowlerScoreId.sis_id }
        });
        yield prisma_1.default.cricketMatch.update({
            where: { sis_id: matchId },
            data: { currentOverId: over.sis_id }
        });
        return res.status(200).json({ over });
    }
    catch (error) {
        logger_1.default.error(`[/matches/createOver] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = { getMatches, addMatch, startMatch, updateMatchToss, getMatch, updateRuns, updateWickets, getOver, updateBowler, createOver };
//# sourceMappingURL=controller.js.map