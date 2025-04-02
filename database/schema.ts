import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
    try {
        const db = SQLite.openDatabaseSync('markers.db');
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS markers (
                id TEXT PRIMARY KEY,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS marker_images (
                id TEXT PRIMARY KEY,
                marker_id TEXT NOT NULL,
                uri TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
            );
        `);
        return db;
    } catch (error) {
        console.error('Ошибка инициализации базы данных:', error);
        throw error;
    }
};