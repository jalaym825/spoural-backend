"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("./controller"));
const express_1 = require("express");
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
router.get('/year/:year', controller_1.default.getTeams);
router.post('/', middleware_1.verifyJWT, middleware_1.isSportsHead, controller_1.default.addTeam);
// get team data
router.get('/team/:id', controller_1.default.getTeam);
// get team data by name
router.get('/name/:name', controller_1.default.getTeamByName);
// return all players applied for selection
router.get('/:id/players', controller_1.default.getPlayers);
// add player to team
router.put('/player', middleware_1.verifyJWT, controller_1.default.addPlayer);
// player is selected in team
router.put('/player/:playerId/select', middleware_1.verifyJWT, middleware_1.isSportsHead, controller_1.default.selectPlayer);
// player is removed from team
router.put('/player/:playerId/remove', middleware_1.verifyJWT, middleware_1.isSportsHead, controller_1.default.removePlayer);
// send selection mail to all selected players
router.put('/sendSelectionMail/:teamId', middleware_1.verifyJWT, middleware_1.isSportsHead, controller_1.default.sendSelectionMail);
router.get('/:teamId/scorecard/:matchId', controller_1.default.getScoreCard);
router.get('/:teamId/battersscore/:matchId', controller_1.default.getBattingScore);
router.get('/:teamId/bowlersscore/:matchId', controller_1.default.getBowlingScore);
// export default router;
exports.default = router;
//# sourceMappingURL=index.js.map