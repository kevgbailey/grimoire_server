import { GameRoles, RoleCategories } from '../middleware/roles';
import { GameStatus } from '../models/interfaces';
import GameRepository from '../db/GameRepository';
import { Game, Player, StatusEffect, Role, GameState} from '../models/interfaces';

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

    public async getUserGames(userId: number): Promise<Game[]> {
        return await this.gameRepository.getGamesByUserId(userId);
    }

    public async storeGame(game: Game, players: Player[], roles: Role[], statusEffects: StatusEffect[]): Promise<void> {
        console.log('Storing game:', game);
        // Add creation date and number of players to the game
        game.startDate = new Date().toISOString();
        game.numPlayers = players.length;
        await this.gameRepository.storeGame(game, players, roles, statusEffects);
    }

    public async getGameById(gameId: number): Promise<GameState> {
        const game = await this.gameRepository.getGameById(gameId);
        const players = await this.gameRepository.getPlayersByGameId(gameId);
        const roles = await this.gameRepository.getRolesByGameId(gameId);
        const statusEffects = await this.gameRepository.getStatusEffectsByGameId(gameId);
        const gameState: GameState = {
            game: game,
            players: players,
            roles: roles,
            statusEffects: statusEffects
        };
        return gameState;
    }
}