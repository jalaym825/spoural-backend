import { Request, Response } from 'express';
import logger from '../../utils/logger';
import prisma from '../../utils/prisma';

const getMatches = async (req: Request, res: Response) => {
    try {
        const { year } = req.params;

        // Input validation
        if (!year || !/^\d{4}$/.test(year)) {
            logger.warn(`[/matches] - Invalid year parameter: ${year}`);
            return res.status(400).json({
                error: "Invalid year parameter"
            });
        }

        const matches = await prisma.cricketMatch.findMany({
            where: {
                year: year
            },
            orderBy: {
                date: 'desc'
            },
            include: {
                team1: true,
                team2: true,
                wonByTeam: true
            }
        });

        logger.info(`[/matches] - ${matches.length} matches found for year ${year}`);

        return res.status(200).json({
            matches
        });
    } catch (error: any) {
        logger.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

const getMatch = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;

        // Input validation
        if (!matchId) {
            logger.warn(`[/matches] - Invalid or missing matchId parameter`);
            return res.status(400).json({
                error: "Invalid match id"
            });
        }

        const match = await prisma.cricketMatch.findUnique({
            where: {
                sis_id: matchId
            },
            include: {
                team1: true,
                team2: true,
                wonByTeam: true
            }
        });

        if (!match) {
            logger.warn(`[/matches] - Match not found for matchId: ${matchId}`);
            return res.status(404).json({
                error: "Match not found"
            });
        }

        logger.info(`[/matches] - Match found for matchId: ${match.sis_id}`);

        return res.status(200).json({
            match
        });
    } catch (error: any) {
        logger.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

const addMatch = async (req: Request, res: Response) => {
    try {
        const { date, team1Id, team2Id } = req.body;

        // Input validation
        if (!date || !team1Id || !team2Id) {
            logger.warn(`[/matches] - Invalid or missing data in the request body`);
            logger.debug(`[/matches] - date: ${date}, team1Id: ${team1Id}, team2Id: ${team2Id}`);
            return res.status(400).json({
                error: "Invalid data"
            });
        }

        // Calculate the year from the date
        const year = new Date(date).getFullYear().toString();

        // Create the match
        const match = await prisma.cricketMatch.create({
            data: {
                date,
                team1Id,
                team2Id,
                year,
            }
        });

        logger.info(`[/matches] - Match added, match ID: ${match.sis_id}`);

        return res.status(200).json({
            match
        });
    } catch (error: any) {
        logger.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

interface CustomRequest extends Request {
    match?: any
}

const startMatch = async (req: CustomRequest, res: Response) => {
    try {
        // Check if the match has already started
        if (req.match.played) {
            logger.warn(`[/matches] - Match already started`);
            return res.status(400).json({
                error: "Match already started"
            });
        }

        // Destructure necessary data from the request body
        const { overs, powerPlayOvers, overPerBowler, tossWonByTeamId, tossDecision, strikerId, nonStrikerId, bowlerId } = req.body;

        // Create a new over for the match
        const over = await prisma.cricketOver.create({
            data: {
                matchId: req.match.sis_id,
                bowlerId,
                strikerId,
                nonStrikerId,
                balls: 0
            }
        });

        // Update match details to reflect the match has started
        const match = await prisma.cricketMatch.update({
            where: {
                sis_id: req.match.sis_id
            },
            data: {
                overs,
                overPerBowler,
                powerPlayOvers,
                tossWonBy: tossWonByTeamId,
                tossDecision,
                currentOverSis_id: over.sis_id,
                played: true
            }
        });

        logger.info(`[/matches] - Match started, Match ID: ${match.sis_id}`);

        return res.status(200).json({
            match
        });
    } catch (error: any) {
        logger.error(`[/matches] - Error occurred: ${error.message}`);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

const updateMatchToss = async (req: CustomRequest, res: Response) => {
    try {
        if (req.match.tossWonBy) {
            logger.warn(`[/matches] - match toss already updated`);
            return res.status(400).json({
                error: "Match toss already updated"
            });
        }
        const { tossWonBy } = req.body;
        const match = await prisma.cricketMatch.update({
            where: {
                sis_id: req.match.sis_id
            },
            data: {
                tossWonBy
            },
            include: {
                tossWonByTeam: true
            }
        });

        logger.info(`[/matches/updateMatchToss] - match toss updated, match: ${match.sis_id}`);

        return res.status(200).json({
            match
        });
    } catch (error: any) {
        logger.error(`[/matches/updateMatchToss] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

const updateRuns = async (req: CustomRequest, res: Response) => {
    try {
        const { matchId } = req.params;
        const { runs, validBall, invalidBallType } = req.body;

        // Validate matchId
        if (!matchId || typeof matchId !== 'string') {
            logger.warn(`[/matches] - Invalid matchId: ${matchId}`);
            return res.status(400).json({ error: "Invalid match ID" });
        }

        // Validate runs
        if (typeof runs !== 'number' || isNaN(runs) || runs < 0) {
            logger.warn(`[/matches] - Invalid runs: ${runs}`);
            return res.status(400).json({ error: "Invalid runs" });
        }

        // Fetch the match with the current over details
        const match = await prisma.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: { currentOver: true }
        });

        // Validate match existence
        if (!match) {
            logger.warn(`[/matches] - Match not found for matchId: ${matchId}`);
            return res.status(404).json({ error: "Match not found" });
        }

        // Validate if the match has started
        if (!match.played || !match.currentOver) {
            logger.warn(`[/matches] - Match not started or current over not available for matchId: ${matchId}`);
            return res.status(400).json({ error: "Match not started" });
        }

        // Determine batting team
        const battingTeam = match.team1Id === match.currentOver.bowlerId ? match.team2Id : match.team1Id;

        // Determine which team's runs and balls to update
        const updateData = {
            team1Runs: match.team1Runs ?? 0,
            team2Runs: match.team2Runs ?? 0,
            team1Balls: match.team1Balls ?? 0,
            team2Balls: match.team2Balls ?? 0,
        };

        // Update runs and balls based on batting team
        if (battingTeam === match.currentOver.strikerId) {
            updateData.team1Runs += runs;
            if (validBall) updateData.team1Balls += 1;
        } else {
            updateData.team2Runs += runs;
            if (validBall) updateData.team2Balls += 1;
        }

        // Update match data
        const updatedMatch = await prisma.cricketMatch.update({
            where: { sis_id: match.sis_id },
            data: updateData,
            include: { currentOver: true }
        });

        // Update current over data
        const updatedOver = await prisma.cricketOver.update({
            where: { sis_id: match.currentOver.sis_id },
            data: {
                balls: match.currentOver.balls + 1,
                runs: match.currentOver.runs + runs,
                validBalls: match.currentOver.validBalls + (validBall ? 1 : 0)
            },
            include: { striker: true }
        });

        // Update striker player's runs
        const updatedPlayer = await prisma.cricketPlayer.update({
            where: { sis_id: updatedOver.striker.sis_id },
            data: { runs: updatedOver.striker.runs + runs }
        });

        const ball = await prisma.cricketOverBall.create({
            data: {
                overId: updatedOver.sis_id,
                ballNo: updatedOver.validBalls + 1,
                runs,
                ballType: invalidBallType ? "normal" : invalidBallType
            }
        });

        return res.status(200).json({ match: updatedMatch, over: updatedOver, striker: updatedPlayer, ball });
    } catch (error: any) {
        logger.error(`[/matches/updateMatchScore] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateWickets = async (req: CustomRequest, res: Response) => {
    try {
        const { matchId } = req.params;
        const { wicketType, nextStriker } = req.body;

        // Validate matchId
        if (!matchId || typeof matchId !== 'string') {
            logger.warn(`[/matches] - Invalid matchId: ${matchId}`);
            return res.status(400).json({ error: "Invalid match ID" });
        }

        // Validate wicketType
        if (!wicketType || typeof wicketType !== 'string') {
            logger.warn(`[/matches] - Invalid wicketType: ${wicketType}`);
            return res.status(400).json({ error: "Invalid wicket type" });
        }

        // Fetch the match with the current over details
        const match = await prisma.cricketMatch.findUnique({
            where: { sis_id: matchId },
            include: { currentOver: true }
        });

        // Validate match existence
        if (!match) {
            logger.warn(`[/matches] - Match not found for matchId: ${matchId}`);
            return res.status(404).json({ error: "Match not found" });
        }

        // Validate if the match has started
        if (!match.played || !match.currentOver) {
            logger.warn(`[/matches] - Match not started or current over not available for matchId: ${matchId}`);
            return res.status(400).json({ error: "Match not started" });
        }

        // Determine batting team
        const battingTeam = match.team1Id === match.currentOver.bowlerId ? match.team2Id : match.team1Id;

        // Determine which team's wickets to update
        const updateData = {
            team1Wickets: match.team1Wickets ?? 0,
            team2Wickets: match.team2Wickets ?? 0,
        };

        // Update wickets based on batting team
        if (battingTeam === match.currentOver.strikerId) {
            updateData.team1Wickets += 1;
        } else {
            updateData.team2Wickets += 1;
        }

        // Update match data
        const updatedMatch = await prisma.cricketMatch.update({
            where: { sis_id: match.sis_id },
            data: updateData,
            include: { currentOver: true }
        });

        // Update current over data
        const updatedOver = await prisma.cricketOver.update({
            where: { sis_id: match.currentOver.sis_id },
            data: {
                wickets: { increment: 1 }
            },
            include: { striker: true }
        });

        // Update striker player's wickets
        const updatedPlayer = await prisma.cricketPlayer.update({
            where: { sis_id: updatedOver.bowlerId },
            data: { noOfWickets: { increment: 1 } }
        });

        return res.status(200).json({ match: updatedMatch, over: updatedOver, striker: updatedPlayer });

    }
    catch (error: any) {
        logger.error(`[/matches/updateMatchScore] - ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export default { getMatches, addMatch, startMatch, updateMatchToss, getMatch, updateRuns, updateWickets }