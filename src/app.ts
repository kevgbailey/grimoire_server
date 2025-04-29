import express, { Application } from 'express';
import { GameController } from './controllers/GameController';
import { AuthController } from './controllers/AuthController';
import { authenticateToken } from './middleware/AuthRequest';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config(); // Add this to load environment variables

const app: Application = express();
const port: number = 3000;

app.use(cors({
    origin: ['https://d3o323iha7apq5.cloudfront.net', "http://localhost:5173"], // Vite's default port
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize controllers
const gameController = new GameController();
const authController = new AuthController();

// Public auth routes
app.use('/api/auth', authController.router);

// Protected game routes
app.use('/api/game', authenticateToken, gameController.router);

app.listen(port, '0.0.0.0', (): void => {
    console.log(`Server is running on http://localhost:${port}`);
});