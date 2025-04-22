import * as fs from 'node:fs/promises';
import * as path from 'path';
import { Game, Player, StatusEffect, User } from '../models/interfaces';
import { Client } from 'pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

interface DatabaseSchema {
    roles: any;
    users: User[];
    games: Game[];
    players: Player[];
    statusEffects: StatusEffect[];
}

export class DB {
    private static instance: DB;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error']
        });
        
        // Connect to the database when the instance is created
        this.prisma.$connect()
            .then(() => console.log("✅ Connected to PostgreSQL via Prisma"))
            .catch((err: unknown) => console.error("❌ Prisma connection error:", err));
    }

    public static getInstance(): DB {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }

    public getPrisma(): PrismaClient {
        return this.prisma;
    }

    public async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }

    // public async readDB(): Promise<DatabaseSchema> {
    //     try {
    //         const data = await fs.readFile(this.dbPath, 'utf8');
    //         const parsed = JSON.parse(data) as DatabaseSchema;
            
    //         if (!this.isValidDatabaseSchema(parsed)) {
    //             throw new Error('Invalid database schema');
    //         }
            
    //         return parsed;
    //     } catch (error) {
    //         // Add logging
    //         console.error('Error reading database:', error);
            
    //         // Only initialize if file doesn't exist
    //         if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
    //             const emptyDB: DatabaseSchema = {
    //                 roles: [],
    //                 users: [],
    //                 games: [],
    //                 players: [],
    //                 statusEffects: []
    //             };
    //             await this.writeDB(emptyDB);
    //             return emptyDB;
    //         }
            
    //         throw error; // Re-throw other errors
    //     }
    // }

    // public async writeDB(data: DatabaseSchema): Promise<void> {
    //     await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
    // }

    // private isValidDatabaseSchema(data: any): data is DatabaseSchema {
    //     return (
    //         data &&
    //         Array.isArray(data.users) &&
    //         Array.isArray(data.games) &&
    //         Array.isArray(data.players) &&
    //         Array.isArray(data.statusEffects)
    //     );
    // }
}

export function getPrismaClient(): PrismaClient {
    return DB.getInstance().getPrisma();
}
