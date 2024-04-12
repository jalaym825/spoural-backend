require('events').EventEmitter.defaultMaxListeners = 15; // or a value appropriate for your application
import prisma from './utils/prisma';
import express, {Request, Response} from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import routes from './router';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import 'colors';

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: '*',
}));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());


const io = new Server(server, {
    cors:{
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`user connected socketId: ${socket.id}`);
    socket.on("runsUpdated", data => {
        console.log(data)
        socket.broadcast.emit("updateRuns");
    })
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
})

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
    prisma.$connect().then(() => {
        console.log('Connected to database');
    })
    routes(app);
});

app.get("/", (req: Request, res: Response) => {
    // res.json({ message: "Hello World" });
    res.json("OK");
})