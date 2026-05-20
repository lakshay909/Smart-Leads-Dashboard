import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app: Application = express();

// Middleware
app.use(cors({
  origin: '*', // Assignment aur testing ke liye sabse safe, kisi bhi frontend URL ko allow kar dega
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Basic Route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Smart Leads Dashboard API is running...');
});

// Error handling middleware (basic setup for now)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
