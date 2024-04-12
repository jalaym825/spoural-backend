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
const getScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamABatting = yield prisma_1.default.cricketMatchPlayerBattingScore.findMany({
            where: { matchId: req.match.team1Id },
        });
        const teamAScoreBowling = yield prisma_1.default.cricketMatchPlayerBowlingScore.findMany({
            where: { matchId: req.match.team1Id },
        });
        const teamBBatting = yield prisma_1.default.cricketMatchPlayerBattingScore.findMany({
            where: { matchId: req.match.team2Id },
        });
        const teamBScoreBowling = yield prisma_1.default.cricketMatchPlayerBowlingScore.findMany({
            where: { matchId: req.match.team2Id },
        });
        res.status(200).json({
            teamAScore: {
                batting: teamABatting,
                bowling: teamAScoreBowling
            },
            teamBScore: {
                batting: teamBBatting,
                bowling: teamBScoreBowling
            }
        });
    }
    catch (err) {
        logger_1.default.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
const updateScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json({
            message: "In Progress..."
        });
    }
    catch (err) {
        logger_1.default.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
exports.default = { getScore, updateScore };
//# sourceMappingURL=controller.js.map