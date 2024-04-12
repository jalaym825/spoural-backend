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
const prisma_1 = __importDefault(require("../../utils/prisma"));
const logger_1 = __importDefault(require("../../utils/logger"));
const heplers_1 = require("../../utils/heplers");
const axios_1 = __importDefault(require("axios"));
const mailer_1 = __importDefault(require("../../utils/mailer"));
function generatePassword(length) {
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
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            logger_1.default.warn(`[/team/:id] - data missing`);
            logger_1.default.debug(`[/team/:id] - id: ${id}`);
            return res.status(400).json({
                error: "Invalid id"
            });
        }
        const team = yield prisma_1.default.cricketTeam.findUnique({
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
            logger_1.default.warn(`[/team/:id] - team not found`);
            logger_1.default.debug(`[/team/:id] - id: ${id}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        logger_1.default.info(`[/team/:id] - ${team.name} found`);
        return res.status(200).json({ team });
    }
    catch (error) {
        logger_1.default.error(`[/team/:id] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const getTeamByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        if (!name) {
            logger_1.default.warn(`[/getTeamByName/:name] - data missing`);
            logger_1.default.debug(`[/getTeamByName/:name] - name: ${name}`);
            return res.status(400).json({
                error: "Invalid name"
            });
        }
        const team = yield prisma_1.default.cricketTeam.findFirst({
            where: {
                name: name.toLowerCase(),
                year: new Date(Date.now()).getFullYear().toString()
            },
        });
        if (!team) {
            logger_1.default.warn(`[/getTeamByName/:name] - team not found`);
            logger_1.default.debug(`[/getTeamByName/:name] - name: ${name}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        logger_1.default.info(`[/getTeamByName/:name] - ${team.name} found`);
        return res.status(200).json({ team });
    }
    catch (error) {
        logger_1.default.error(`[/team/:id] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year } = req.params;
        if (!year) {
            logger_1.default.warn(`[/team] - data missing`);
            logger_1.default.debug(`[/team] - year: ${year}`);
            return res.status(400).json({
                error: "Invalid year"
            });
        }
        const teams = yield prisma_1.default.cricketTeam.findMany({
            where: {
                year: year
            },
            include: {
                players: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        logger_1.default.info(`[/team] - ${teams.length} teams found`);
        return res.status(200).json({ teams });
    }
    catch (error) {
        logger_1.default.error(`[/team] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const addTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            logger_1.default.warn(`[/team] - data missing`);
            logger_1.default.debug(`[/team] - name: ${name}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const exist = yield prisma_1.default.cricketTeam.findFirst({
            where: {
                name: name.toLowerCase()
            }
        });
        if (exist) {
            logger_1.default.warn(`[/team/addTeam] - team already exists`);
            logger_1.default.debug(`[/team/addTeam] - team: ${name}, ${exist.sis_id}`);
            return res.status(400).json({
                error: "Team already exists",
            });
        }
        const team = yield prisma_1.default.cricketTeam.create({
            data: {
                name: name.toLowerCase(),
                year: new Date(Date.now()).getFullYear().toString()
            }
        });
        logger_1.default.info(`[/team] - ${team.name} added`);
        return res.status(200).json({ team });
    }
    catch (error) {
        logger_1.default.error(`[/team] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const addPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId, playerEmail, userId, playerCategory } = req.body;
        if (!teamId || !playerEmail) {
            logger_1.default.warn(`[/team/player] - data missing`);
            logger_1.default.debug(`[/team/player] - teamId: ${teamId} playerEmail: ${playerEmail}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        if ((0, heplers_1.isValidEmail)(playerEmail) === false) {
            logger_1.default.warn(`[/team/player] - invalid email`);
            logger_1.default.debug(`[/team/player] - email: ${playerEmail}`);
            return res.status(400).json({
                error: "Invalid email"
            });
        }
        let user = yield prisma_1.default.users.findUnique({
            where: {
                email: playerEmail
            }
        });
        if (!user) {
            user = yield prisma_1.default.users.create({
                data: {
                    userId,
                    email: playerEmail,
                    name: generateName(), // Add the 'name' property with a default value
                    password: generatePassword(6) // Add the 'password' property with a default value
                }
            });
            yield axios_1.default.post(`${process.env.SERVER_URL}/auth/sendVerificationMail`, {
                email: playerEmail
            });
        }
        let player = yield prisma_1.default.cricketPlayer.findUnique({
            where: {
                userId
            },
            include: {
                user: true
            }
        });
        if (player) {
            logger_1.default.warn(`[/team/player] - player already exists`);
            logger_1.default.debug(`[/team/player] - player: ${player.user.userId}`);
            return res.status(400).json({
                error: "Player have already applied for the team selection"
            });
        }
        player = yield prisma_1.default.cricketPlayer.create({
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
        });
        const team = yield prisma_1.default.cricketTeam.update({
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
        yield mailer_1.default.sendAppliedMail(playerEmail, team.name, user.rec_status);
        logger_1.default.info(`[/team/player] - ${player.user.userId} added`);
        return res.status(200).json({ team });
    }
    catch (error) {
        logger_1.default.error(`[/team/player] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const getPlayers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const selectedPlayers = req.query.selectedPlayers === 'true';
        if (!id) {
            logger_1.default.warn(`[/team/:id/players] - data missing`);
            logger_1.default.debug(`[/team/:id/players] - id: ${id}`);
            return res.status(400).json({
                error: "Invalid id"
            });
        }
        let team;
        const include = {
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
        team = yield prisma_1.default.cricketTeam.findFirst({
            where: {
                sis_id: id
            },
            include: include
        });
        if (!team) {
            logger_1.default.warn(`[/team/:id/players] - team not found`);
            logger_1.default.debug(`[/team/:id/players] - id: ${id}`);
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
        logger_1.default.info(`[/team/:id/players] - ${team.name} found`);
        return res.status(200).json({ players: team.players });
    }
    catch (error) {
        logger_1.default.error(`[/team/:id/players] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const selectPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { playerId } = req.params;
        if (!playerId) {
            logger_1.default.warn(`[/team/player/:id] - data missing`);
            logger_1.default.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        let player = yield prisma_1.default.cricketPlayer.findUnique({
            where: {
                sis_id: playerId
            }
        });
        if (!player) {
            logger_1.default.warn(`[/team/player/:id] - player not found`);
            logger_1.default.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(404).json({
                error: "Player not found"
            });
        }
        if (player.isSelected) {
            logger_1.default.warn(`[/team/player/:id] - player already selected`);
            logger_1.default.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(400).json({
                error: "Player already selected"
            });
        }
        player = yield prisma_1.default.cricketPlayer.update({
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
        logger_1.default.info(`[/team/player/:id] - ${player.sis_id} selected`);
        return res.status(200).json({ player });
    }
    catch (error) {
        logger_1.default.error(`[/team/player/:id] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const removePlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { playerId } = req.params;
        if (!playerId) {
            logger_1.default.warn(`[/team/player/:id] - data missing`);
            logger_1.default.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        let player = yield prisma_1.default.cricketPlayer.findUnique({
            where: {
                sis_id: playerId
            }
        });
        if (!player) {
            logger_1.default.warn(`[/team/player/:id] - player not found`);
            logger_1.default.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(404).json({
                error: "Player not found"
            });
        }
        if (!player.isSelected) {
            logger_1.default.warn(`[/team/player/:id] - player already selected`);
            logger_1.default.debug(`[/team/player/:id] - playerId: ${playerId}`);
            return res.status(400).json({
                error: "Player isn't in team."
            });
        }
        player = yield prisma_1.default.cricketPlayer.update({
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
        logger_1.default.info(`[/team/player/:id] - ${player.sis_id} got rejected`);
        return res.status(200).json({ player });
    }
    catch (error) {
        logger_1.default.error(`[/team/player/:id] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const sendSelectionMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        if (!teamId) {
            logger_1.default.warn(`[/team/sendSelectionMail/:teamId] - data missing`);
            logger_1.default.debug(`[/team/sendSelectionMail/:teamId] - teamId: ${teamId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const team = yield prisma_1.default.cricketTeam.findUnique({
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
            logger_1.default.warn(`[/team/sendSelectionMail/:teamId] - team not found`);
            logger_1.default.debug(`[/team/sendSelectionMail/:teamId] - teamId: ${teamId}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        let selectedPlayers = team.players.filter((player) => player.isSelected);
        if (selectedPlayers.length === 0) {
            logger_1.default.warn(`[/team/sendSelectionMail/:teamId] - no players selected`);
            logger_1.default.debug(`[/team/sendSelectionMail/:teamId] - teamId: ${teamId}`);
            return res.status(400).json({
                error: "No players selected"
            });
        }
        let emails = selectedPlayers.map((player) => player.user.email);
        yield mailer_1.default.sendSelectionMail(emails, team.name);
        logger_1.default.info(`[/team/sendSelectionMail/:teamId] - mail sent to ${emails.length} players`);
        return res.status(200).json({ message: "Mail sent" });
    }
    catch (error) {
        logger_1.default.error(`[/team/sendSelectionMail/:teamId] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const getScoreCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId, matchId } = req.params;
        if (!teamId || !matchId) {
            logger_1.default.warn(`[/team/battinscore/:teamId] - data missing`);
            logger_1.default.debug(`[/team/battinscore/:teamId] - teamId: ${teamId} matchId: ${matchId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const team = yield prisma_1.default.cricketTeam.findUnique({
            where: {
                sis_id: teamId
            }
        });
        if (!team) {
            logger_1.default.warn(`[/team/battinscore/:teamId] - team not found`);
            logger_1.default.debug(`[/team/battinscore/:teamId] - teamId: ${teamId}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        const scoreCard = yield prisma_1.default.cricketTeamMatchData.findUnique({
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
        logger_1.default.info(`[/team/battinscore/:teamId] - scorecard found for ${team.name} | ${team.sis_id}`);
        return res.status(200).json({ scoreCard });
    }
    catch (error) {
        logger_1.default.error(`[/team/battinscore/:teamId] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const getBattingScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { teamId, matchId, played = false } = req.params;
        played = played === 'true';
        if (!teamId || !matchId) {
            logger_1.default.warn(`[/team/battinscore/:teamId] - data missing`);
            logger_1.default.debug(`[/team/battinscore/:teamId] - teamId: ${teamId} matchId: ${matchId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const team = yield prisma_1.default.cricketTeam.findUnique({
            where: {
                sis_id: teamId
            }
        });
        if (!team) {
            logger_1.default.warn(`[/team/battinscore/:teamId] - team not found`);
            logger_1.default.debug(`[/team/battinscore/:teamId] - teamId: ${teamId}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        const data = {};
        if (played) {
            data.played = played;
        }
        const batters = yield prisma_1.default.cricketMatchPlayerBattingScore.findMany({
            where: Object.assign(Object.assign({}, data), { teamId,
                matchId }),
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
        logger_1.default.info(`[/team/battinscore/:teamId] - scorecard found for ${team.name} | ${team.sis_id}`);
        return res.status(200).json({ batters });
    }
    catch (error) {
        logger_1.default.error(`[/team/battinscore/:teamId] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const getBowlingScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { teamId, matchId, played = false } = req.params;
        played = played === "true";
        if (!teamId || !matchId) {
            logger_1.default.warn(`[/team/bowlersscore/:teamId] - data missing`);
            logger_1.default.debug(`[/team/bowlersscore/:teamId] - teamId: ${teamId} matchId: ${matchId}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }
        const team = yield prisma_1.default.cricketTeam.findUnique({
            where: {
                sis_id: teamId
            }
        });
        if (!team) {
            logger_1.default.warn(`[/team/bowlersscore/:teamId] - team not found`);
            logger_1.default.debug(`[/team/bowlersscore/:teamId] - teamId: ${teamId}`);
            return res.status(404).json({
                error: "Team not found"
            });
        }
        const data = {};
        if (played) {
            data.played = played;
        }
        const bowlers = yield prisma_1.default.cricketMatchPlayerBowlingScore.findMany({
            where: Object.assign(Object.assign({}, data), { teamId,
                matchId }),
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
        logger_1.default.info(`[/team/bowlersscore/:teamId] - scorecard found for ${team.name} | ${team.sis_id}`);
        return res.status(200).json({ bowlers });
    }
    catch (error) {
        logger_1.default.error(`[/team/bowlersscore/:teamId] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
exports.default = { getTeams, addTeam, addPlayer, getTeam, getPlayers, getTeamByName, selectPlayer, removePlayer, sendSelectionMail, getScoreCard, getBattingScore, getBowlingScore };
//# sourceMappingURL=controller.js.map