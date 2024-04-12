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
const getPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            logger_1.default.warn(`[/player] - data missing`);
            logger_1.default.debug(`[/player] - id: ${id}`);
            return res.status(400).json({
                error: "Invalid id"
            });
        }
        const player = yield prisma_1.default.cricketPlayer.findUnique({
            where: {
                sis_id: id
            },
        });
        logger_1.default.info(`[/player] - player found`);
        return res.status(200).json({
            player
        });
    }
    catch (error) {
        logger_1.default.error(`[/player] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
const getPlayerMatchBattingScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matchId, playerId } = req.params;
        if (!matchId) {
            logger_1.default.warn(`[/player/matches/score] - data missing`);
            logger_1.default.debug(`[/player/matches/score] - matchId: ${matchId}`);
            return res.status(400).json({
                error: "Invalid matchId"
            });
        }
        if (!playerId) {
            logger_1.default.warn(`[/player/matches/score] - data missing`);
            logger_1.default.debug(`[/player/matches/score] - playerId: ${playerId}`);
            return res.status(400).json({
                error: "Invalid playerId"
            });
        }
        const playerMatchBattingScore = yield prisma_1.default.cricketMatchPlayerBattingScore.findUnique({
            where: {
                matchId_playerId: {
                    matchId,
                    playerId
                }
            },
            include: {
                player: { include: { user: true } }
            }
        });
        logger_1.default.info(`[/player/matches/score] - player match score found`);
        return res.status(200).json({
            playerMatchBattingScore
        });
    }
    catch (error) {
        logger_1.default.error(`[/player/matches/score] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
});
exports.default = { getPlayer, getPlayerMatchBattingScore };
//# sourceMappingURL=controller.js.map