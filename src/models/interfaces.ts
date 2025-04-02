export enum GameStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELED = 'canceled'
}

// export enum DeathType {
//     NONE = false,
//     EXECUTED = 'executed',
//     KILLED = 'killed',
//     POISONED = 'poisoned'
// }

export interface User {
    user_id: number;
    email: string;
    pass: string;
}

export interface Game {
    game_id: number;
    storyteller_id: number;  // References User.user_id
    night: number;
    status: GameStatus;
}

export interface Player {
    player_id: number;
    game_id: number;        // References Game.game_id
    name: string;
    role_id: number;        // References Role.role_id
    isDead: boolean;
    drunkRole: number | null;
    hasVote: boolean;
}

export interface Role {
    role_id: number;
    name: string;
    description: string;
    night_order: number | null;
    first_night_order: number | null;
}

export interface StatusEffect {
    player_id: number;     // References Player.player_id
    name: string;
}

// API Response Types
export interface GameListResponse {
    game_ids: number[];
}

export interface GameDetailResponse extends Game {
    players: Player[];
}

export interface StartGameRequest {
    players: Omit<Player, 'player_id' | 'game_id'>[];
}

export interface SaveGameRequest {
    game: Game;
    players: Player[];
    statusEffects: StatusEffect[];
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
