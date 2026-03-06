import express from "express";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.route.js"

const app = express();

import cors from 'cors';

app.use(cors({
    origin: 'http://localhost:5500',
    credentials: true,               
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//Allow that express can read json.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

//Route url.
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

export default app;