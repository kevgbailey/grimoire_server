import { Router, Request, Response } from 'express';
import { GameService } from '../services/GameService';

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
}