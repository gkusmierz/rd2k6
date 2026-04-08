import Database from "better-sqlite3";
export declare function getDatabase(dbPath?: string): Database.Database;
export declare function closeDatabase(): void;
export declare function createTestDatabase(): Database.Database;
export declare function runMigrations(database: Database.Database): void;
//# sourceMappingURL=database.d.ts.map