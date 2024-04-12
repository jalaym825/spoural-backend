
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.12.1
 * Query Engine version: 23fdc5965b1e05fc54e5f26ed3de66776b93de64
 */
Prisma.prismaVersion = {
  client: "5.12.1",
  engine: "23fdc5965b1e05fc54e5f26ed3de66776b93de64"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.OTPScalarFieldEnum = {
  otp: 'otp',
  email: 'email',
  createdAt: 'createdAt'
};

exports.Prisma.UsersScalarFieldEnum = {
  userId: 'userId',
  email: 'email',
  name: 'name',
  password: 'password',
  token: 'token',
  roles: 'roles',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  rec_status: 'rec_status',
  cricketPlayerId: 'cricketPlayerId'
};

exports.Prisma.CricketTeamScalarFieldEnum = {
  sis_id: 'sis_id',
  name: 'name',
  year: 'year'
};

exports.Prisma.CricketPlayerScalarFieldEnum = {
  sis_id: 'sis_id',
  userId: 'userId',
  teamId: 'teamId',
  isSelected: 'isSelected',
  isCaptain: 'isCaptain',
  isWicketKeeper: 'isWicketKeeper',
  isAllRounder: 'isAllRounder',
  isBatsman: 'isBatsman',
  isBowler: 'isBowler',
  runs: 'runs',
  noOfMatchesPlayed: 'noOfMatchesPlayed',
  noOfSixes: 'noOfSixes',
  noOfFours: 'noOfFours',
  noOfWicketsTaken: 'noOfWicketsTaken',
  noOfHalfCenturies: 'noOfHalfCenturies',
  noOfCenturies: 'noOfCenturies',
  noOfWickets: 'noOfWickets'
};

exports.Prisma.CricketMatchScalarFieldEnum = {
  sis_id: 'sis_id',
  played: 'played',
  tossWonBy: 'tossWonBy',
  tossDecision: 'tossDecision',
  date: 'date',
  venue: 'venue',
  year: 'year',
  dependency: 'dependency',
  dependentOn: 'dependentOn',
  team1Wickets: 'team1Wickets',
  team2Wickets: 'team2Wickets',
  team1Runs: 'team1Runs',
  team2Runs: 'team2Runs',
  team1Balls: 'team1Balls',
  team2Balls: 'team2Balls',
  overs: 'overs',
  powerPlayOvers: 'powerPlayOvers',
  overPerBowler: 'overPerBowler',
  currentOverId: 'currentOverId',
  wonBy: 'wonBy',
  teamAId: 'teamAId',
  teamBId: 'teamBId',
  teamAScoreId: 'teamAScoreId',
  teamBScoreId: 'teamBScoreId',
  battingTeamScoreId: 'battingTeamScoreId',
  bowlingTeamScoreId: 'bowlingTeamScoreId'
};

exports.Prisma.CricketTeamMatchDataScalarFieldEnum = {
  sis_id: 'sis_id',
  teamId: 'teamId',
  matchId: 'matchId',
  name: 'name',
  runs: 'runs',
  wideRuns: 'wideRuns',
  nbRuns: 'nbRuns',
  byeRuns: 'byeRuns',
  lbRuns: 'lbRuns',
  wickets: 'wickets',
  balls: 'balls'
};

exports.Prisma.CricketOverScalarFieldEnum = {
  sis_id: 'sis_id',
  matchId: 'matchId',
  runs: 'runs',
  wickets: 'wickets',
  totalBalls: 'totalBalls',
  validBalls: 'validBalls',
  strikerScoreId: 'strikerScoreId',
  nonStrikerScoreId: 'nonStrikerScoreId',
  bowlerScoreId: 'bowlerScoreId'
};

exports.Prisma.CricketOverBallScalarFieldEnum = {
  sis_id: 'sis_id',
  overId: 'overId',
  ballNo: 'ballNo',
  runs: 'runs',
  wicket: 'wicket',
  ballType: 'ballType',
  extras: 'extras',
  wicketType: 'wicketType',
  deliveryType: 'deliveryType'
};

exports.Prisma.CricketMatchPlayerBattingScoreScalarFieldEnum = {
  sis_id: 'sis_id',
  runs: 'runs',
  balls: 'balls',
  fours: 'fours',
  sixes: 'sixes',
  strikeRate: 'strikeRate',
  out: 'out',
  played: 'played',
  wicketType: 'wicketType',
  playerId: 'playerId',
  matchId: 'matchId',
  teamId: 'teamId'
};

exports.Prisma.CricketMatchPlayerBowlingScoreScalarFieldEnum = {
  sis_id: 'sis_id',
  runs: 'runs',
  balls: 'balls',
  fours: 'fours',
  sixes: 'sixes',
  played: 'played',
  wickets: 'wickets',
  playerId: 'playerId',
  matchId: 'matchId',
  teamId: 'teamId'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  sis_id: 'sis_id',
  token: 'token',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  expiration: 'expiration'
};

exports.Prisma.TicketScalarFieldEnum = {
  sis_id: 'sis_id',
  userEmail: 'userEmail',
  userName: 'userName',
  userId: 'userId',
  title: 'title',
  description: 'description',
  visited: 'visited',
  status: 'status',
  createdAt: 'createdAt',
  closedAt: 'closedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  SPORTS_HEAD: 'SPORTS_HEAD',
  DEPT_SPORTS_CC: 'DEPT_SPORTS_CC'
};

exports.BallType = exports.$Enums.BallType = {
  NORMAL: 'NORMAL',
  NO_BALL: 'NO_BALL',
  WIDE: 'WIDE',
  LEG_BYE: 'LEG_BYE',
  BYE: 'BYE'
};

exports.Prisma.ModelName = {
  OTP: 'OTP',
  Users: 'Users',
  CricketTeam: 'CricketTeam',
  CricketPlayer: 'CricketPlayer',
  CricketMatch: 'CricketMatch',
  CricketTeamMatchData: 'CricketTeamMatchData',
  CricketOver: 'CricketOver',
  CricketOverBall: 'CricketOverBall',
  CricketMatchPlayerBattingScore: 'CricketMatchPlayerBattingScore',
  CricketMatchPlayerBowlingScore: 'CricketMatchPlayerBowlingScore',
  VerificationToken: 'VerificationToken',
  Ticket: 'Ticket'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
