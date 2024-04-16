import cluster, { Worker } from "cluster";
import os from 'os';
import prisma from './utils/prisma';
import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import routes from './router';
import cookieParser from 'cookie-parser';
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import 'colors';
const config = require('../config.json');

const numCPUs = 1;
// const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    setupPrimary();
    
    // Ensure 'cluster' is indeed the Cluster module
    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    // Worker process
    console.log(`Worker ${process.pid} started`);

    const app = express();
    const server = http.createServer(app);

    app.use(cors({
        origin: '*',
    }));
    app.use(express.json());
    app.use(helmet());
    app.use(cookieParser());


    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        adapter: createAdapter()
    });

    io.on("connection", (socket) => {
        console.log(`user connected socketId: ${socket.id}`);
        socket.on("runsUpdated", (match: any) => { // Adjust the type as per your data structure
            console.log(match)
            socket.broadcast.emit("updateRuns", match);
        })
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    })

    const port = config.PORT || 3000;

    server.listen(port, () => {
        console.log(`Worker ${process.pid} is listening on port ${port}`);
        prisma.$connect().then(() => {
            console.log('Connected to database');
        })
        routes(app);
    });

    app.get("/", (req: Request, res: Response) => {
        // res.json({ message: "Hello World" });
        res.json("OK");
    })
}
