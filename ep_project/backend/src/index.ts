import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});