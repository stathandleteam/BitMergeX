import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());



export default app;