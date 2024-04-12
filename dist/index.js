"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('events').EventEmitter.defaultMaxListeners = 15; // or a value appropriate for your application
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const router_1 = __importDefault(require("./router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("colors");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log(`user connected socketId: ${socket.id}`);
    socket.on("runsUpdated", data => {
        console.log(data);
        socket.broadcast.emit("updateRuns");
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
    prisma.$connect().then(() => {
        console.log('Connected to database');
    });
    (0, router_1.default)(app);
});
app.get("/", (req, res) => {
    // res.json({ message: "Hello World" });
    res.json("OK");
});
//# sourceMappingURL=index.js.map