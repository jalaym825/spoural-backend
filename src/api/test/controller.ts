import { Request, Response } from 'express';
import prisma from '../../utils/prisma';
import { CricketMatchPlayerBattingScore } from '@prisma/client';


const getTest = async (req:Request, res:Response) => {
    const batters = await prisma.cricketTeamMatchData.findUnique({
        where: {
            teamId_matchId: {
                teamId: req.params.teamId || "",
                matchId: req.params.matchId || "",
            }
        }
    })
    console.log(batters)
}


export default { getTest }