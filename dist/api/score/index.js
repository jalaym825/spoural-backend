"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
router.get('/:matchId', middleware_1.isValidMatch, middleware_1.isMatchPlayed, controller_1.default.getScore);
router.post('/:matchId', middleware_1.verifyJWT, middleware_1.isValidMatch, middleware_1.isMatchPlayed, controller_1.default.updateScore);
// export default router;
exports.default = router;
//# sourceMappingURL=index.js.map