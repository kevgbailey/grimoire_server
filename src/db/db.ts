import * as fs from 'node:fs/promises';
import * as path from 'path';
import { Game, Player, StatusEffect, User } from '../models/interfaces';

interface DatabaseSchema {
    roles: any;
    users: User[];
    games: Game[];
    players: Player[];
    statusEffects: StatusEffect[];
}

export class JsonDB {
    private static instance: JsonDB;
    private dbPath: string;

    private constructor() {
        this.dbPath = path.resolve(__dirname, '../db/database.json');
    }

    public static getInstance(): JsonDB {
        if (!JsonDB.instance) {
            JsonDB.instance = new JsonDB();
        }
        return JsonDB.instance;
    }

    public async readDB(): Promise<DatabaseSchema> {
        try {
            const data = await fs.readFile(this.dbPath, 'utf8');
            const parsed = JSON.parse(data) as DatabaseSchema;
            
            if (!this.isValidDatabaseSchema(parsed)) {
                throw new Error('Invalid database schema');
            }
            
            return parsed;
        } catch (error) {
            // Add logging
            console.error('Error reading database:', error);
            
            // Only initialize if file doesn't exist
            if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
                const emptyDB: DatabaseSchema = {
                    roles: [],
                    users: [],
                    games: [],
                    players: [],
                    statusEffects: []
                };
                await this.writeDB(emptyDB);
                return emptyDB;
            }
            
            throw error; // Re-throw other errors
        }
    }

    public async writeDB(data: DatabaseSchema): Promise<void> {
        await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
    }

    private isValidDatabaseSchema(data: any): data is DatabaseSchema {
        return (
            data &&
            Array.isArray(data.users) &&
            Array.isArray(data.games) &&
            Array.isArray(data.players) &&
            Array.isArray(data.statusEffects)
        );
    }
}
