import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './Routes/AuthRouter.js';
import dotenv from 'dotenv';
import './Models/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});