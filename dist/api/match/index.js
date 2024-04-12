"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
router.get('/year/:year', controller_1.default.getMatches);
router.get('/:matchId', controller_1.default.getMatch);
router.get('/overs/:overId', controller_1.default.getOver);
router.post('/', middleware_1.verifyJWT, middleware_1.isSportsHead, controller_1.default.addMatch);
router.put('/:matchId/start', middleware_1.verifyJWT, middleware_1.isSportsHead, middleware_1.isValidMatch, controller_1.default.startMatch);
router.put('/:matchId/toss', middleware_1.verifyJWT, middleware_1.isSportsHead, middleware_1.isValidMatch, controller_1.default.updateMatchToss);
router.put('/runs/:matchId', middleware_1.verifyJWT, middleware_1.isSportsHead, middleware_1.isValidMatch, controller_1.default.updateRuns);
router.put('/wicket/:matchId', middleware_1.verifyJWT, middleware_1.isSportsHead, middleware_1.isValidMatch, controller_1.default.updateWickets);
router.put('/bowler/:matchId', middleware_1.verifyJWT, middleware_1.isSportsHead, middleware_1.isValidMatch, controller_1.default.updateBowler);
router.post('/over/:matchId', middleware_1.verifyJWT, middleware_1.isSportsHead, middleware_1.isValidMatch, controller_1.default.createOver);
// router.delete('/delete/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.deleteMatch);
// export default router;
exports.default = router;
//# sourceMappingURL=index.js.map