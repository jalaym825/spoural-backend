"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const router = (0, express_1.Router)();
router.put('/test/:matchId/:teamId', controller_1.default.getTest);
// router.delete('/delete/:matchId', verifyJWT, isSportsHead, isValidMatch, controller.deleteMatch);
// export default router;
exports.default = router;
//# sourceMappingURL=index.js.map