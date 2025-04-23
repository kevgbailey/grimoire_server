import { getPrismaClient } from "./db";
import {
  Game,
  GameStatus,
  Player,
  StatusEffect,
  Role,
} from "../models/interfaces";
import { GameRoles } from "../middleware/roles";

class GameRepository {
  constructor() {}

  public async getGamesByUserId(userId: number): Promise<Game[]> {
    try {
      const prisma = getPrismaClient();
      const games = await prisma.game.findMany({
        where: {
          storytellerId: userId,
        },
      });

      return games.map((game) => ({
        game_id: game.id,
        storyteller_id: game.storytellerId,
        night: game.night,
        status: game.status as GameStatus,
        startDate: game.startDate, // Keep as string
        numPlayers: game.numPlayers,
      }));
    } catch (error) {
      console.error("Error fetching games by user ID:", error);
      return [];
    }
  }

  public async storeGame(
    game: Game,
    players: Player[],
    roles: Role[],
    statusEffects: StatusEffect[]
  ): Promise<void> {
    try {
      const prisma = getPrismaClient();

      const createdGame = await prisma.game.create({
        data: {
          storytellerId: game.storyteller_id,
          night: game.night,
          status: game.status,
          startDate: game.startDate, // Keep as string
          numPlayers: game.numPlayers,
          players: {
            create: players.map((player) => ({
              name: player.name,
              roleId: player.role_id,
              isDead: player.isDead,
              drunkRole: player.drunkRole,
              hasVote: player.hasVote,
            })),
          },
        },
      });

      // Add status effects in a separate operation if needed
      if (statusEffects && statusEffects.length > 0) {
        for (const effect of statusEffects) {
          await prisma.statusEffect.create({
            data: {
              playerId: effect.player_id,
              name: effect.name,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error storing game:", error);
      throw new Error(
        `Failed to store game: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async getGameById(gameId: number): Promise<Game> {
    try {
      const prisma = getPrismaClient();
      const game = await prisma.game.findUnique({
        where: { id: gameId },
      });

      if (!game) {
        throw new Error(`Game with ID ${gameId} not found`);
      }

      return {
        game_id: game.id,
        storyteller_id: game.storytellerId,
        night: game.night,
        status: game.status as GameStatus,
        startDate: game.startDate, // Keep as string
        numPlayers: game.numPlayers,
      };
    } catch (error) {
      console.error(`Error fetching game ${gameId}:`, error);
      throw error;
    }
  }

  public async getPlayersByGameId(gameId: number): Promise<Player[]> {
    try {
      const prisma = getPrismaClient();
      const players = await prisma.player.findMany({
        where: { gameId },
      });

      return players.map((player) => ({
        player_id: player.id,
        game_id: player.gameId,
        name: player.name,
        role_id: player.roleId,
        isDead: player.isDead,
        drunkRole: player.drunkRole,
        hasVote: player.hasVote,
      }));
    } catch (error) {
      console.error(`Error fetching players for game ${gameId}:`, error);
      return [];
    }
  }

  public async getRolesByGameId(gameId: number): Promise<Role[]> {
    try {
      const players = await this.getPlayersByGameId(gameId);
      const roleIds = [...new Set(players.map((player) => player.role_id))];
      const gameRoles = GameRoles.getInstance();
      const roles: Role[] = [];

      roleIds.forEach((id) => {
        const role = gameRoles.getRoleById(id);
        if (role) {
          roles.push(role);
        }
      });

      return roles;
    } catch (error) {
      console.error(`Error fetching roles for game ${gameId}:`, error);
      return [];
    }
  }

  public async getStatusEffectsByGameId(
    gameId: number
  ): Promise<StatusEffect[]> {
    try {
      const prisma = getPrismaClient();
      const players = await this.getPlayersByGameId(gameId);
      const playerIds = players.map((player) => player.player_id);

      const statusEffects = await prisma.statusEffect.findMany({
        where: {
          playerId: { in: playerIds },
        },
      });

      return statusEffects.map((effect) => ({
        player_id: effect.playerId,
        name: effect.name,
      }));
    } catch (error) {
      console.error(`Error fetching status effects for game ${gameId}:`, error);
      return [];
    }
  }
}

export default GameRepository;
