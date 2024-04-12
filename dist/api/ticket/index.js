"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
router.get('/', middleware_1.verifyJWT, middleware_1.isSportsHead, controller_1.default.getTickets);
router.get('/:ticketId', middleware_1.verifyJWT, middleware_1.isSportsHead, controller_1.default.getTicket);
router.post('/', controller_1.default.createTicket);
router.post('/reply/:ticketId', middleware_1.verifyJWT, middleware_1.isSportsHead, controller_1.default.reply);
exports.default = router;
//# sourceMappingURL=index.js.map