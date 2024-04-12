"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("./controller"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/resetPassword', controller_1.default.resetPassword);
router.post('/verify', controller_1.default.verify);
router.post('/changePassword', controller_1.default.changePassword);
exports.default = router;
//# sourceMappingURL=index.js.map