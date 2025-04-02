import { Router, Request, Response } from 'express';
import { GameService } from '../services/GameService';
import { GameStatus } from '../models/interfaces';

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
        //this.router.get('/get_games/:userId', this.getUserGames.bind(this));
        // Add more routes as needed
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
}

    // private async getUserGames(req: Request, res: Response): Promise<void> {
    //     try {
    //         const userId = parseInt(req.params.userId);
    //         const status = req.query.status as GameStatus | undefined;

    //         if (isNaN(userId)) {
    //             res.status(400).json({ message: 'Invalid user ID' });
    //             return;
    //         }

    //         const games = await this.gameService.getUserGames(userId, status);
    //         res.status(200).json({ game_ids: games });
    //     } catch (error) {
    //         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    //         res.status(500).json({ message: errorMessage });
    //     }
    // }
