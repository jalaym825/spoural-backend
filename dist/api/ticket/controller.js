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
const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, status } = req.query;
        if (!page || !limit) {
            logger_1.default.error('[/tickets] - Page and limit are required');
            return res.status(400).json({ error: 'Page and limit are required' });
        }
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const whereClause = { status: status || undefined };
        const tickets = yield prisma_1.default.ticket.findMany({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            where: whereClause,
            orderBy: [{ status: 'asc' }, { createdAt: 'asc' }] // Sort tickets first by status then by createdAt
        });
        logger_1.default.info(`[/tickets] - Fetched ${tickets.length} tickets`);
        res.status(200).json({ tickets });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId } = req.params;
        if (!ticketId) {
            logger_1.default.error('[/tickets/:ticketId] - Ticket id is required');
            return res.status(400).json({ error: 'Ticket id is required' });
        }
        const ticket = yield prisma_1.default.ticket.findUnique({
            where: { sis_id: ticketId }
        });
        if (!ticket) {
            logger_1.default.error(`[/tickets/:ticketId] - Ticket not found with id: ${ticketId}`);
            return res.status(404).json({ error: 'Ticket not found' });
        }
        logger_1.default.info(`[/tickets/:ticketId] - Fetched ticket with id: ${ticketId}`);
        res.status(200).json({ ticket });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, userName, userEmail, userId } = req.body;
        if (!title || !description || !userName || !userEmail) {
            logger_1.default.error('[/tickets/createTicket] - title, description, userName, userEmail are required');
            return res.status(400).json({ error: 'Details are missing.' });
        }
        if (!(0, heplers_1.isValidEmail)(userEmail)) {
            logger_1.default.warn(`[/tickets/createTicket] - invalid email`);
            logger_1.default.debug(`[/tickets/createTicket] - email: ${userEmail}`);
            return res.status(400).json({
                error: "Please provide a valid email",
            });
        }
        const ticket = yield prisma_1.default.ticket.create({
            data: {
                userEmail,
                userName,
                title,
                description,
                userId: userId || null,
                status: 'open'
            }
        });
        logger_1.default.info(`[/tickets] - Created ticket with id: ${ticket.sis_id}`);
        res.status(201).json({ ticket });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const reply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId } = req.params;
        const { message } = req.body;
        if (!ticketId) {
            logger_1.default.error('[/tickets/reply] - Ticket id is required');
            return res.status(400).json({ error: 'Ticket id is required' });
        }
        if (!message) {
            logger_1.default.error('[/tickets/reply] - Message is required');
            return res.status(400).json({ error: 'Message is required' });
        }
        const ticket = yield prisma_1.default.ticket.findUnique({
            where: { sis_id: ticketId }
        });
        if (!ticket) {
            logger_1.default.error(`[/tickets/reply] - Ticket not found with id: ${ticketId}`);
            return res.status(404).json({ error: 'Ticket not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = { getTicket, getTickets, createTicket, reply };
//# sourceMappingURL=controller.js.map