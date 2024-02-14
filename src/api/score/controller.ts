import { Request, Response } from 'express'
import logger from '../../utils/logger'
import prisma from '../../utils/prisma'

interface CustomRequest extends Request {
    match?: any
}


const getScore = async (req: CustomRequest, res: Response) => {
    try {
        const teamABatting = await prisma.cricketMatchPlayerBattingScore.findMany({
            where: { matchId: req.match.team1Id },
        })

        const teamAScoreBowling = await prisma.cricketMatchPlayerBowlingScore.findMany({
            where: { matchId: req.match.team1Id },
        })

        const teamBBatting = await prisma.cricketMatchPlayerBattingScore.findMany({
            where: { matchId: req.match.team2Id },
        })

        const teamBScoreBowling = await prisma.cricketMatchPlayerBowlingScore.findMany({
            where: { matchId: req.match.team2Id },
        })

        res.status(200).json({
            teamA: {
                batting: teamABatting,
                bowling: teamAScoreBowling
            },
            teamB: {
                batting: teamBBatting,
                bowling: teamBScoreBowling
            }
        })

    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Something went wrong' })
    }
}

const updateScore = async (req: CustomRequest, res: Response) => {
    try {
        return res.json({
            message: "In Progress..."
        })
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Something went wrong' })
    }
}

export default { getScore, updateScore }