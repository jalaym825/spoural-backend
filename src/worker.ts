import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createAdapter } from "@socket.io/cluster-adapter";
import routes from './router';
import 'colors';
import { PrismaClient } from '@prisma/client'; // Assuming you have prisma client installed

export default function worker() {
  const prisma = new PrismaClient(); // Initialize prisma client

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
    socket.on("runsUpdated", (match: any) => { 
      console.log(match)
      socket.broadcast.emit("updateRuns", match);
    })
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  })

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Worker ${process.pid} is listening on port ${port}`);
    prisma.$connect().then(() => {
      console.log('Connected to database');
    })
    // Import and use routes from a separate file
    routes(app);
  });

  app.get("/", (req: Request, res: Response) => {
    res.json("OK");
  })
}