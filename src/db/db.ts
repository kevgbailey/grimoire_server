import * as fs from 'node:fs/promises';
import * as path from 'path';
import { Game, Player, StatusEffect, User } from '../models/interfaces';

interface DatabaseSchema {
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
            
            // Validate the structure
            if (!this.isValidDatabaseSchema(parsed)) {
                throw new Error('Invalid database schema');
            }
            
            return parsed;
        } catch (error) {
            // Initialize empty database if file doesn't exist
            const emptyDB: DatabaseSchema = {
                users: [],
                games: [],
                players: [],
                statusEffects: []
            };
            await this.writeDB(emptyDB);
            return emptyDB;
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
