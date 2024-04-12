
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.12.1
 * Query Engine version: 473ed3124229e22d881cb7addf559799debae1ab
 */
Prisma.prismaVersion = {
  client: "5.12.1",
  engine: "473ed3124229e22d881cb7addf559799debae1ab"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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


  const path = require('path')

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/jalaymovaliya/SGP-2/SGP-2-Backend/prisma/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "5.12.1",
  "engineVersion": "473ed3124229e22d881cb7addf559799debae1ab",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./generated/client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nenum Role {\n  USER\n  SPORTS_HEAD\n  DEPT_SPORTS_CC\n}\n\nenum BallType {\n  NORMAL\n  NO_BALL\n  WIDE\n  LEG_BYE\n  BYE\n}\n\nmodel OTP {\n  otp       String   @unique\n  email     String\n  createdAt DateTime @default(now())\n}\n\nmodel Users {\n  userId             String              @id @unique\n  email              String              @unique\n  name               String?\n  password           String?\n  token              String?\n  roles              Role[]              @default([USER])\n  createdAt          DateTime            @default(now())\n  updatedAt          DateTime            @updatedAt\n  // department         String?\n  rec_status         Boolean             @default(false)\n  cricketPlayerId    String?\n  cricketPlayer      CricketPlayer?      @relation(\"cricketPlayer\", fields: [cricketPlayerId], references: [sis_id])\n  cricket_players    CricketPlayer[]     @relation(\"playerUser\")\n  verification_token VerificationToken[] @relation(\"verificationToken\")\n  user_tickets       Ticket[]            @relation(\"userTickets\")\n}\n\n// model CricketSchedule {\n//   sis_id        String       @id @default(uuid())\n//   // matchId       String       @unique\n//   match         CricketMatch @relation(\"scheduleMatches\", fields: [sis_id], references: [sis_id])\n//   team1Id       String\n//   team1         CricketTeam  @relation(\"team1\", fields: [team1Id], references: [sis_id])\n//   team2Id       String\n//   team2         CricketTeam  @relation(\"team2\", fields: [team2Id], references: [sis_id])\n//   dependendency Boolean      @default(false)\n//   date          DateTime\n//   year          String\n// }\n\nmodel CricketTeam {\n  sis_id String @id @default(uuid())\n  name   String\n  year   String\n\n  players                            CricketPlayer[]\n  winning_team                       CricketMatch[]                   @relation(\"winningTeam\")\n  toss_winning_team                  CricketMatch[]                   @relation(\"tossWinningTeam\")\n  player_team                        CricketPlayer[]                  @relation(\"playerTeam\")\n  cricket_match_teamData             CricketTeamMatchData[]           @relation(\"CricketTeamMatchData\")\n  cricket_match_player_batting_score CricketMatchPlayerBattingScore[] @relation(\"playerBattingScoreTeam\")\n  cricket_match_player_bowling_score CricketMatchPlayerBowlingScore[] @relation(\"playerBowlingScoreTeam\")\n  CricketMatchTeamA                  CricketMatch[]                   @relation(\"cricketMatchTeamA\")\n  CricketMatchTeamB                  CricketMatch[]                   @relation(\"cricketMatchTeamB\")\n}\n\nmodel CricketPlayer {\n  sis_id String  @id @default(uuid())\n  // playerId             String         @unique\n  // name String\n  userId String  @unique\n  user   Users   @relation(\"playerUser\", fields: [userId], references: [userId])\n  teamId String?\n\n  isSelected Boolean @default(false)\n\n  isCaptain      Boolean @default(false)\n  isWicketKeeper Boolean @default(false)\n  isAllRounder   Boolean @default(false)\n  isBatsman      Boolean @default(false)\n  isBowler       Boolean @default(false)\n\n  runs              Int @default(0)\n  noOfMatchesPlayed Int @default(0)\n  noOfSixes         Int @default(0)\n  noOfFours         Int @default(0)\n  noOfWicketsTaken  Int @default(0)\n  noOfHalfCenturies Int @default(0)\n  noOfCenturies     Int @default(0)\n  noOfWickets       Int @default(0)\n\n  matches              CricketMatch[]                   @relation(\"playerMatches\")\n  team                 CricketTeam?                     @relation(\"playerTeam\", fields: [teamId], references: [sis_id])\n  user_cricket_players Users[]                          @relation(\"cricketPlayer\")\n  team_players         CricketTeam[] //@relation(\"playerTeam\")\n  batting_score_player CricketMatchPlayerBattingScore[] @relation(\"battingScorePlayer\")\n  bowling_score_player CricketMatchPlayerBowlingScore[] @relation(\"bowlingScoreMatchPlayer\")\n}\n\nmodel CricketMatch {\n  sis_id String  @id @default(uuid())\n  // matchId          String           @unique\n  played Boolean @default(false)\n\n  tossWonBy     String?\n  tossWonByTeam CricketTeam? @relation(\"tossWinningTeam\", fields: [tossWonBy], references: [sis_id])\n  tossDecision  String?\n\n  date  DateTime\n  venue String?\n  year  String\n\n  dependency  Boolean @default(false)\n  dependentOn String?\n\n  team1Wickets Int? @default(0)\n  team2Wickets Int? @default(0)\n\n  team1Runs Int? @default(0)\n  team2Runs Int? @default(0)\n\n  team1Balls Int? @default(0)\n  team2Balls Int? @default(0)\n\n  overs          Int? @default(0)\n  powerPlayOvers Int? @default(0)\n  overPerBowler  Int? @default(0)\n\n  currentOverId String?\n  currentOver   CricketOver? @relation(\"currentOver\", fields: [currentOverId], references: [sis_id])\n\n  wonBy     String?\n  wonByTeam CricketTeam? @relation(\"winningTeam\", fields: [wonBy], references: [sis_id])\n\n  teamAId String?\n  teamA   CricketTeam? @relation(\"cricketMatchTeamA\", fields: [teamAId], references: [sis_id])\n  teamBId String?\n  teamB   CricketTeam? @relation(\"cricketMatchTeamB\", fields: [teamBId], references: [sis_id])\n\n  teamAScoreId String?\n  teamAScore   CricketTeamMatchData? @relation(\"cricketMatchTeamA\", fields: [teamAScoreId], references: [sis_id])\n  teamBScoreId String?\n  teamBScore   CricketTeamMatchData? @relation(\"cricketMatchTeamB\", fields: [teamBScoreId], references: [sis_id])\n\n  battingTeamScoreId String?\n  battingTeam        CricketTeamMatchData? @relation(\"matchBttingTeam\", fields: [battingTeamScoreId], references: [sis_id])\n  bowlingTeamScoreId String?\n  bowlingTeam        CricketTeamMatchData? @relation(\"matchBowlingTeam\", fields: [bowlingTeamScoreId], references: [sis_id])\n\n  players            CricketPlayer[]                  @relation(\"playerMatches\")\n  over_match         CricketOver[]                    @relation(\"match\")\n  team_batting_score CricketMatchPlayerBattingScore[] @relation(\"playerBattingScoreMatch\")\n  team_bowling_score CricketMatchPlayerBowlingScore[] @relation(\"playerBowlingScoreMatch\")\n}\n\nmodel CricketTeamMatchData {\n  sis_id  String  @id @default(uuid())\n  teamId  String?\n  matchId String?\n  name    String?\n\n  runs     Int @default(0)\n  wideRuns Int @default(0)\n  nbRuns   Int @default(0)\n  byeRuns  Int @default(0)\n  lbRuns   Int @default(0)\n  wickets  Int @default(0)\n  balls    Int @default(0)\n\n  batters CricketMatchPlayerBattingScore[] @relation(\"batters\")\n  bowlers CricketMatchPlayerBowlingScore[] @relation(\"bowlers\")\n\n  team              CricketTeam?   @relation(\"CricketTeamMatchData\", fields: [teamId], references: [sis_id])\n  cricketMatchTeamA CricketMatch[] @relation(\"cricketMatchTeamA\")\n  cricketMatchTeamB CricketMatch[] @relation(\"cricketMatchTeamB\")\n  matchBttingTeam   CricketMatch[] @relation(\"matchBttingTeam\")\n  matchBowlingTeam  CricketMatch[] @relation(\"matchBowlingTeam\")\n\n  @@unique([teamId, matchId])\n}\n\nmodel CricketOver {\n  sis_id String @id @default(uuid())\n\n  matchId String\n  match   CricketMatch @relation(\"match\", fields: [matchId], references: [sis_id])\n\n  runs    Int @default(0)\n  wickets Int @default(0)\n\n  totalBalls Int @default(0)\n  validBalls Int @default(0)\n\n  strikerScoreId String\n  strikerScore   CricketMatchPlayerBattingScore @relation(\"overStriker\", fields: [strikerScoreId], references: [sis_id])\n\n  nonStrikerScoreId String\n  nonStrikerScore   CricketMatchPlayerBattingScore @relation(\"overNonStriker\", fields: [nonStrikerScoreId], references: [sis_id])\n\n  bowlerScoreId String\n  bowlerScore   CricketMatchPlayerBowlingScore @relation(\"overBowler\", fields: [bowlerScoreId], references: [sis_id])\n\n  balls              CricketOverBall[] @relation(\"overBall\")\n  match_current_over CricketMatch[]    @relation(\"currentOver\")\n}\n\nmodel CricketOverBall {\n  sis_id       String      @id @default(uuid())\n  overId       String\n  over         CricketOver @relation(\"overBall\", fields: [overId], references: [sis_id])\n  ballNo       Int\n  runs         Int\n  wicket       Boolean     @default(false)\n  ballType     BallType    @default(NORMAL)\n  extras       Int         @default(0)\n  wicketType   String?\n  deliveryType String? // Optional, for advanced ball analysis\n}\n\nmodel CricketMatchPlayerBattingScore {\n  sis_id     String  @id @default(uuid())\n  runs       Int     @default(0)\n  balls      Int     @default(0)\n  fours      Int     @default(0)\n  sixes      Int     @default(0)\n  strikeRate Float   @default(0)\n  out        Boolean @default(false)\n  played     Boolean @default(false)\n  wicketType String?\n\n  playerId String?\n  player   CricketPlayer? @relation(\"battingScorePlayer\", fields: [playerId], references: [sis_id])\n\n  matchId String\n  match   CricketMatch @relation(\"playerBattingScoreMatch\", fields: [matchId], references: [sis_id])\n\n  teamId String\n  team   CricketTeam @relation(\"playerBattingScoreTeam\", fields: [teamId], references: [sis_id])\n\n  match_batters    CricketTeamMatchData[] @relation(\"batters\")\n  over_striker     CricketOver[]          @relation(\"overStriker\")\n  over_non_striker CricketOver[]          @relation(\"overNonStriker\")\n\n  @@unique([matchId, playerId])\n}\n\nmodel CricketMatchPlayerBowlingScore {\n  sis_id  String  @id @default(uuid())\n  runs    Int     @default(0)\n  balls   Int     @default(0)\n  fours   Int     @default(0)\n  sixes   Int     @default(0)\n  played  Boolean @default(false)\n  wickets Int     @default(0)\n\n  playerId String?\n  player   CricketPlayer? @relation(\"bowlingScoreMatchPlayer\", fields: [playerId], references: [sis_id])\n\n  matchId String\n  match   CricketMatch @relation(\"playerBowlingScoreMatch\", fields: [matchId], references: [sis_id])\n\n  teamId String\n  team   CricketTeam @relation(\"playerBowlingScoreTeam\", fields: [teamId], references: [sis_id])\n\n  match_bowlers CricketTeamMatchData[] @relation(\"bowlers\")\n  over_bowler   CricketOver[]          @relation(\"overBowler\")\n\n  @@unique([matchId, playerId])\n}\n\nmodel VerificationToken {\n  sis_id     String   @id @default(uuid())\n  token      String   @unique\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n  expiration DateTime\n  user       Users    @relation(\"verificationToken\", fields: [sis_id], references: [userId])\n}\n\nmodel Ticket {\n  sis_id      String    @id @default(uuid())\n  userEmail   String\n  userName    String\n  userId      String?\n  user        Users?    @relation(\"userTickets\", fields: [userId], references: [userId])\n  title       String\n  description String\n  visited     Boolean   @default(false)\n  status      String    @default(\"open\")\n  createdAt   DateTime  @default(now())\n  closedAt    DateTime?\n}\n",
  "inlineSchemaHash": "939705ff43e4cbb573d547811050cd2675863accc8a1ccbd30648cab1545b6ca",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "prisma/generated/client",
    "generated/client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"OTP\":{\"dbName\":null,\"fields\":[{\"name\":\"otp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Users\":{\"dbName\":null,\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"roles\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Role\",\"default\":[\"USER\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"rec_status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cricketPlayerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cricketPlayer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketPlayer\",\"relationName\":\"cricketPlayer\",\"relationFromFields\":[\"cricketPlayerId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cricket_players\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketPlayer\",\"relationName\":\"playerUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verification_token\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VerificationToken\",\"relationName\":\"verificationToken\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_tickets\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ticket\",\"relationName\":\"userTickets\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CricketTeam\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"year\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"players\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketPlayer\",\"relationName\":\"CricketPlayerToCricketTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"winning_team\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"winningTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"toss_winning_team\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"tossWinningTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"player_team\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketPlayer\",\"relationName\":\"playerTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cricket_match_teamData\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeamMatchData\",\"relationName\":\"CricketTeamMatchData\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cricket_match_player_batting_score\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBattingScore\",\"relationName\":\"playerBattingScoreTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cricket_match_player_bowling_score\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBowlingScore\",\"relationName\":\"playerBowlingScoreTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"CricketMatchTeamA\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"cricketMatchTeamA\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"CricketMatchTeamB\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"cricketMatchTeamB\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CricketPlayer\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Users\",\"relationName\":\"playerUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isSelected\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isCaptain\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isWicketKeeper\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAllRounder\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isBatsman\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isBowler\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"noOfMatchesPlayed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"noOfSixes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"noOfFours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"noOfWicketsTaken\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"noOfHalfCenturies\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"noOfCenturies\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"noOfWickets\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matches\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"playerMatches\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeam\",\"relationName\":\"playerTeam\",\"relationFromFields\":[\"teamId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_cricket_players\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Users\",\"relationName\":\"cricketPlayer\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team_players\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeam\",\"relationName\":\"CricketPlayerToCricketTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"batting_score_player\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBattingScore\",\"relationName\":\"battingScorePlayer\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bowling_score_player\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBowlingScore\",\"relationName\":\"bowlingScoreMatchPlayer\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CricketMatch\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"played\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tossWonBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tossWonByTeam\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeam\",\"relationName\":\"tossWinningTeam\",\"relationFromFields\":[\"tossWonBy\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tossDecision\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"venue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"year\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dependency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dependentOn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team1Wickets\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team2Wickets\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team1Runs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team2Runs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team1Balls\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team2Balls\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"overs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"powerPlayOvers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"overPerBowler\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentOverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentOver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketOver\",\"relationName\":\"currentOver\",\"relationFromFields\":[\"currentOverId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wonBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wonByTeam\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeam\",\"relationName\":\"winningTeam\",\"relationFromFields\":[\"wonBy\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamAId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamA\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeam\",\"relationName\":\"cricketMatchTeamA\",\"relationFromFields\":[\"teamAId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamBId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamB\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeam\",\"relationName\":\"cricketMatchTeamB\",\"relationFromFields\":[\"teamBId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamAScoreId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamAScore\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeamMatchData\",\"relationName\":\"cricketMatchTeamA\",\"relationFromFields\":[\"teamAScoreId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamBScoreId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamBScore\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeamMatchData\",\"relationName\":\"cricketMatchTeamB\",\"relationFromFields\":[\"teamBScoreId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"battingTeamScoreId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"battingTeam\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeamMatchData\",\"relationName\":\"matchBttingTeam\",\"relationFromFields\":[\"battingTeamScoreId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bowlingTeamScoreId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bowlingTeam\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeamMatchData\",\"relationName\":\"matchBowlingTeam\",\"relationFromFields\":[\"bowlingTeamScoreId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"players\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketPlayer\",\"relationName\":\"playerMatches\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"over_match\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketOver\",\"relationName\":\"match\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team_batting_score\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBattingScore\",\"relationName\":\"playerBattingScoreMatch\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team_bowling_score\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBowlingScore\",\"relationName\":\"playerBowlingScoreMatch\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CricketTeamMatchData\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matchId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wideRuns\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nbRuns\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"byeRuns\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lbRuns\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wickets\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balls\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"batters\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBattingScore\",\"relationName\":\"batters\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bowlers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBowlingScore\",\"relationName\":\"bowlers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeam\",\"relationName\":\"CricketTeamMatchData\",\"relationFromFields\":[\"teamId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cricketMatchTeamA\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"cricketMatchTeamA\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cricketMatchTeamB\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"cricketMatchTeamB\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matchBttingTeam\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"matchBttingTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matchBowlingTeam\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"matchBowlingTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"teamId\",\"matchId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"teamId\",\"matchId\"]}],\"isGenerated\":false},\"CricketOver\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matchId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"match\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"match\",\"relationFromFields\":[\"matchId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wickets\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalBalls\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"validBalls\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"strikerScoreId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"strikerScore\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBattingScore\",\"relationName\":\"overStriker\",\"relationFromFields\":[\"strikerScoreId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nonStrikerScoreId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nonStrikerScore\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBattingScore\",\"relationName\":\"overNonStriker\",\"relationFromFields\":[\"nonStrikerScoreId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bowlerScoreId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bowlerScore\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatchPlayerBowlingScore\",\"relationName\":\"overBowler\",\"relationFromFields\":[\"bowlerScoreId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balls\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketOverBall\",\"relationName\":\"overBall\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"match_current_over\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"currentOver\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CricketOverBall\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"overId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"over\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketOver\",\"relationName\":\"overBall\",\"relationFromFields\":[\"overId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ballNo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wicket\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ballType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BallType\",\"default\":\"NORMAL\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"extras\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wicketType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveryType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CricketMatchPlayerBattingScore\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balls\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sixes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"strikeRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"out\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"played\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wicketType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"playerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"player\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketPlayer\",\"relationName\":\"battingScorePlayer\",\"relationFromFields\":[\"playerId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matchId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"match\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"playerBattingScoreMatch\",\"relationFromFields\":[\"matchId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeam\",\"relationName\":\"playerBattingScoreTeam\",\"relationFromFields\":[\"teamId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"match_batters\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeamMatchData\",\"relationName\":\"batters\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"over_striker\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketOver\",\"relationName\":\"overStriker\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"over_non_striker\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketOver\",\"relationName\":\"overNonStriker\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"matchId\",\"playerId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"matchId\",\"playerId\"]}],\"isGenerated\":false},\"CricketMatchPlayerBowlingScore\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balls\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sixes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"played\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wickets\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"playerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"player\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketPlayer\",\"relationName\":\"bowlingScoreMatchPlayer\",\"relationFromFields\":[\"playerId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matchId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"match\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketMatch\",\"relationName\":\"playerBowlingScoreMatch\",\"relationFromFields\":[\"matchId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeam\",\"relationName\":\"playerBowlingScoreTeam\",\"relationFromFields\":[\"teamId\"],\"relationToFields\":[\"sis_id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"match_bowlers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketTeamMatchData\",\"relationName\":\"bowlers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"over_bowler\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CricketOver\",\"relationName\":\"overBowler\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"matchId\",\"playerId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"matchId\",\"playerId\"]}],\"isGenerated\":false},\"VerificationToken\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"expiration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Users\",\"relationName\":\"verificationToken\",\"relationFromFields\":[\"sis_id\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Ticket\":{\"dbName\":null,\"fields\":[{\"name\":\"sis_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userEmail\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Users\",\"relationName\":\"userTickets\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visited\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"open\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"Role\":{\"values\":[{\"name\":\"USER\",\"dbName\":null},{\"name\":\"SPORTS_HEAD\",\"dbName\":null},{\"name\":\"DEPT_SPORTS_CC\",\"dbName\":null}],\"dbName\":null},\"BallType\":{\"values\":[{\"name\":\"NORMAL\",\"dbName\":null},{\"name\":\"NO_BALL\",\"dbName\":null},{\"name\":\"WIDE\",\"dbName\":null},{\"name\":\"LEG_BYE\",\"dbName\":null},{\"name\":\"BYE\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-darwin-arm64.dylib.node");
path.join(process.cwd(), "prisma/generated/client/libquery_engine-darwin-arm64.dylib.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "prisma/generated/client/schema.prisma")
