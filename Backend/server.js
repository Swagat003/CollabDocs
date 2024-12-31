import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './Routes/AuthRouter.js';
import documentRouter from './Routes/DocumentRouter.js';
import socketAuthMiddleware from './Middlewares/socketAuthMiddleware.js';
import dotenv from 'dotenv';
import './Models/db.js';
import { Server } from 'socket.io';
import socketRouter from './Routes/SocketRouter.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});

app.use(bodyParser.json());
app.use('/api/auth', authRouter);
app.use('/api/documents', documentRouter);

io.use(socketAuthMiddleware);
socketRouter(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});