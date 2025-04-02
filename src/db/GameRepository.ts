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
} from "../models/interfaces";

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

  public async getGamesByUserId(
    userId: number,
    status?: GameStatus
  ): Promise<number[]> {
    const db = await this.db.readDB();
    let games = db.games.filter((game) => game.storyteller_id === userId);

    if (status) {
      games = games.filter((game) => game.status === status);
    }

    return games.map((game) => game.game_id);
  }

  public async storeGame(
    game: Game,
    players: Player[],
    roles: Role[],
    statusEffects: StatusEffect[]
  ): Promise<void> {
    // Read current database state
    const db = await this.db.readDB();

    // Add new data to respective collections
    db.games.push(game);
    db.players.push(...players);
    db.statusEffects.push(...statusEffects);

    // Write entire updated database back to file
    await this.db.writeDB(db);
  }
}

export default GameRepository;
