import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './Routes/AuthRouter.js';
import documentRouter from './Routes/DocumentRouter.js';
import dotenv from 'dotenv';
import './Models/db.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(bodyParser.json());
app.use('/api/auth', authRouter);
app.use('/api/documents', documentRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});