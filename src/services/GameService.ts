import { GameRoles, RoleCategories } from '../middleware/roles';
import { GameStatus } from '../models/interfaces';
import GameRepository from '../db/GameRepository';
import { Game, Player, StatusEffect, Role} from '../models/interfaces';

export class GameService {
    private gameRoles: GameRoles;
    private gameRepository: GameRepository;
    
    constructor() {
        this.gameRoles = GameRoles.getInstance();
        this.gameRepository = new GameRepository();
    }

    public async getRoles(): Promise<RoleCategories> {
        return this.gameRoles.getAllRoles();
    }

    public async getUserGames(userId: number, status?: GameStatus): Promise<number[]> {
        return await this.gameRepository.getGamesByUserId(userId, status);
    }

    public async storeGame(game: Game, players: Player[], roles: Role[], statusEffects: StatusEffect[]): Promise<void> {
        // Implement game storage logic here
        await this.gameRepository.storeGame(game, players, roles, statusEffects);
    }
}