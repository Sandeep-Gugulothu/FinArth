import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import plansRouter from './routes/plans';
import healthRouter from './routes/health';
import usersRouter from './routes/users';
import dbRouter from './routes/db';
import portfolioRouter from './routes/portfolio';
import './database'; // Initialize database

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/plans', plansRouter);
app.use('/api/health', healthRouter);
app.use('/api/users', usersRouter);
app.use('/api/db', dbRouter);
app.use('/api/portfolio', portfolioRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'FinArth Backend API', status: 'running' });
});

export default app;