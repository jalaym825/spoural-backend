"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../prisma/generated/client");
class Prisma extends client_1.PrismaClient {
    constructor(options = {}) {
        super(options);
    }
}
const prisma = new Prisma();
exports.default = prisma;
//# sourceMappingURL=prisma.js.map