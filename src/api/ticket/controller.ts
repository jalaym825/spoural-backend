import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import logger from "../../utils/logger";
import mailer from "../../utils/mailer"
import { isValidEmail } from "../../utils/heplers";

const getTickets = async (req: Request, res: Response) => {
    try {
        const { page, limit, status } = req.query;
        if (!page || !limit) {
            logger.error('[/tickets] - Page and limit are required');
            return res.status(400).json({ error: 'Page and limit are required' });
        }

        const pageNumber = parseInt(page as string, 10) || 1;
        const pageSize = parseInt(limit as string, 10) || 10;
        const whereClause: any = { status: status as string || undefined };

        const tickets = await prisma.ticket.findMany({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            where: whereClause,
            orderBy: [{ status: 'asc' }, { createdAt: 'asc' }] // Sort tickets first by status then by createdAt
        });
        logger.info(`[/tickets] - Fetched ${tickets.length} tickets`);
        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getTicket = async (req: Request, res: Response) => {
    try {
        const { ticketId } = req.params;
        if (!ticketId) {
            logger.error('[/tickets/:ticketId] - Ticket id is required');
            return res.status(400).json({ error: 'Ticket id is required' });
        }
        const ticket = await prisma.ticket.findUnique({
            where: { sis_id: ticketId }
        });

        if (!ticket) {
            logger.error(`[/tickets/:ticketId] - Ticket not found with id: ${ticketId}`);
            return res.status(404).json({ error: 'Ticket not found' });
        }
        logger.info(`[/tickets/:ticketId] - Fetched ticket with id: ${ticketId}`);
        res.status(200).json({ ticket });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const createTicket = async (req: Request, res: Response) => {
    try {
        const { title, description, userName, userEmail, userId } = req.body;
        if (!title || !description || !userName || !userEmail) {
            logger.error('[/tickets/createTicket] - title, description, userName, userEmail are required');
            return res.status(400).json({ error: 'Details are missing.' });
        }
        if (!isValidEmail(userEmail)) {
            logger.warn(`[/tickets/createTicket] - invalid email`);
            logger.debug(`[/tickets/createTicket] - email: ${userEmail}`);
            return res.status(400).json({
                error: "Please provide a valid email",
            });
        }

        const ticket = await prisma.ticket.create({
            data: {
                userEmail,
                userName,
                title,
                description,
                userId: userId as string || null,
                status: 'open'
            }
        });
        logger.info(`[/tickets] - Created ticket with id: ${ticket.sis_id}`);
        res.status(201).json({ ticket });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
}

const reply = async (req: Request, res: Response) => {
    try {

        const { ticketId } = req.params;
        const { message } = req.body;
        if (!ticketId) {
            logger.error('[/tickets/reply] - Ticket id is required');
            return res.status(400).json({ error: 'Ticket id is required' });
        }
        if (!message) {
            logger.error('[/tickets/reply] - Message is required');
            return res.status(400).json({ error: 'Message is required' });
        }
        const ticket = await prisma.ticket.findUnique({
            where: { sis_id: ticketId }
        });
        if (!ticket) {
            logger.error(`[/tickets/reply] - Ticket not found with id: ${ticketId}`);
            return res.status(404).json({ error: 'Ticket not found' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { getTicket, getTickets, createTicket, reply }