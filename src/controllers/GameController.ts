import { Router, Request, Response } from 'express';
import { GameService } from '../services/GameService';
import { GameStatus, GameState } from '../models/interfaces';
import { AuthRequest } from '../middleware/AuthRequest'; // Add this import

export class GameController {
    public router: Router;
    private gameService: GameService;

    constructor() {
        this.router = Router();
        this.gameService = new GameService();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/roles', this.getRoles.bind(this));
        this.router.post('/store_game', this.storeGame.bind(this));
        this.router.get('/get_games', this.getGamesByUserId.bind(this));
        this.router.get('/get_game/:gameId', this.getGameById.bind(this));
        this.router.get('/get_testusers/:numOfUsers', this.getTestUsers.bind(this));
        //this.router.get('/get_games/:userId', this.getUserGames.bind(this));
        // Add more routes as needed
    }

    private async getTestUsers(req: Request, res: Response): Promise<void> {
        try {
            const numOfUsers = parseInt(req.params.numOfUsers);
            const users = await this.gameService.getTestUsers(numOfUsers);
            res.status(200).json(users);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ message: errorMessage });
        }
    }

    private async getRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = await this.gameService.getRoles();
            res.status(200).json(roles);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ message: errorMessage });
        }
    }

    private async storeGame(req: Request, res: Response): Promise<void> {
        try {
            const { game, players, roles, statusEffects } = req.body;

            if (!game || !players || !roles) {
                res.status(400).json({ message: 'Invalid request body' });
                return;
            }

            try {
                await this.gameService.storeGame(game, players, roles, statusEffects);
                res.status(201).json({ message: 'Game stored successfully' });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                res.status(500).json({ message: errorMessage });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ message: errorMessage });
        }
    }

    private async getGamesByUserId(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user.userId; // Changed from req.params.userId to req.user.userId
            const games = await this.gameService.getUserGames(userId);
            res.status(200).json(games);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ message: errorMessage });
        }
    }

    private async getGameById(req: Request, res: Response): Promise<void> {
        try {
            const gameId = Number(req.params.gameId);
            const game = await this.gameService.getGameById(gameId);
            res.status(200).json(game);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ message: errorMessage });
        }
    }
    
}


