import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import plansRouter from './routes/plans';
import healthRouter from './routes/health';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/plans', plansRouter);
app.use('/api/health', healthRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

export default app;