import User from "../types/user";
import * as fs from "node:fs/promises";
import * as path from "path";
import { JsonDB } from "./db";
import {
  Game,
  GameStatus,
  Player,
  StatusEffect,
  Role,
  GameState,
} from "../models/interfaces";
import { GameRoles } from "../middleware/roles";

class GameRepository {
  private gameDataPath: string;
  private db: JsonDB;

  constructor() {
    this.gameDataPath = path.resolve(__dirname, "../db/users.json");
    this.initializeUsersFile();
    this.db = JsonDB.getInstance() as JsonDB;
  }

  private async initializeUsersFile(): Promise<void> {
    try {
      await fs.access(this.gameDataPath);
    } catch {
      // File doesn't exist, create directory and file
      await fs.mkdir(path.dirname(this.gameDataPath), { recursive: true });
      await fs.writeFile(this.gameDataPath, JSON.stringify([]));
    }
  }

  public async getGamesByUserId(userId: number): Promise<Game[]> {
    const db = await this.db.readDB();
    const games = db.games.filter((game) => game.storyteller_id === userId);
    return games
  }

  public async storeGame(
    game: Game,
    players: Player[],
    roles: Role[],
    statusEffects: StatusEffect[]
  ): Promise<void> {
    // Read current database state
    const db = await this.db.readDB();

    // Add new data to respective collections while preserving existing data
    db.games = [...db.games, game];
    db.players = [...db.players, ...players];
    db.statusEffects = [...db.statusEffects, ...statusEffects];

    // Write entire updated database back to file
    await this.db.writeDB(db);
  }
  public async getGameById(gameId: number): Promise<Game> {
    const db = await this.db.readDB();
    const game = db.games.find((game) => game.game_id === gameId);
    if (!game) {
      throw new Error(`Game with ID ${gameId} not found`);
    }
    return game;
  }

  public async getPlayersByGameId(gameId: number): Promise<Player[]> {
    const db = await this.db.readDB();
    const players = db.players.filter((player) => player.game_id === gameId);
    return players;
  }

  public async getRolesByGameId(gameId: number): Promise<Role[]> {
    // Get all players for this game
    const players = await this.getPlayersByGameId(gameId);
    // Get unique role IDs from these players
    const roleIds = [...new Set(players.map(player => player.role_id))];
    // Get roles from GameRoles singleton
    const gameRoles = GameRoles.getInstance();
    const roles: Role[] = [];
    
    // Safely collect all valid roles
    roleIds.forEach(id => {
      const role = gameRoles.getRoleById(id);
      if (role) {
        roles.push(role);
      }
    });
    
    return roles;
  }

  public async getStatusEffectsByGameId(gameId: number): Promise<StatusEffect[]> {
    const db = await this.db.readDB();
    // Get all players for this game first
    const players = await this.getPlayersByGameId(gameId);
    // Get their player IDs
    const playerIds = players.map(player => player.player_id);
    // Filter status effects for these players
    return db.statusEffects.filter(effect => playerIds.includes(effect.player_id));
  }
  
}

export default GameRepository;
