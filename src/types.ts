import { CricketMatch, CricketMatchPlayerBattingScore, CricketMatchPlayerBowlingScore, CricketOver, CricketOverBall, CricketPlayer, CricketMatchTeamData, Users, VerificationToken } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            match?: CricketMatch & {
                teamAScore?: CricketMatchTeamData
                teamBScore?: CricketMatchTeamData
                battingTeamScore?: CricketMatchTeamData
                bowlingTeamScore?: CricketMatchTeamData
                currentOver?: CricketOver & {
                    strikerScore?: CricketMatchPlayerBattingScore & {
                        player?: CricketPlayer & {
                            user?: Users
                        }
                    },
                    nonStrikerScore?: CricketMatchPlayerBattingScore & {
                        player?: CricketPlayer & {
                            user?: Users
                        }
                    },
                    bowlerScore?: CricketMatchPlayerBowlingScore & {
                        player?: CricketPlayer & {
                            user?: Users
                        }
                    },
                    balls?: CricketOverBall[]
                }
            }
            user?: Users & {
                refreshToken?: VerificationToken
                // roles
            }
        }
    }
}