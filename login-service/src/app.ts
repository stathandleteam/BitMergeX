import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { logger as requestLogger } from './middleware/log.middleware';
import request from 'supertest';

dotenv.config();
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middleware/error.middleware';

const app: Express = express();

// Custom Middleware logger
app.use(requestLogger);

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes

app.get('/', (_req, res) => {
  res.send('it works');
});

// Global error handling middleware
app.use(errorHandler);

export default app;