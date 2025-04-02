import { SQLiteDatabase } from "expo-sqlite";
import { ImageData, MarkerData } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as Crypto from 'expo-crypto';

async function generateUUID(): Promise<string> {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    let result = '';
    for (let i = 0; i < randomBytes.length; i++) {
      result += randomBytes[i].toString(16).padStart(2, '0');
    }
    return result;
};

// Добавляем маркер в таблицу
export const addMarker = async (db: SQLiteDatabase, latitude: number, longitude: number): Promise<string> => {
    try {
        const id = await generateUUID();
        await db.runAsync(
            `INSERT INTO markers (id, latitude, longitude) VALUES (?, ?, ?);`, [id, latitude, longitude]
        );
        return id;
    } catch (error) {
        console.error('Error adding marker:', error);
        throw error;
    }
};


// Получить все маркеры
export const getMarkers = async (db: SQLiteDatabase): Promise<MarkerData[]> => {
    try {
        const result = await db.getAllAsync<MarkerData>(
            'SELECT * FROM markers;'
        );
        return result;
    } catch (error) {
        console.error('Error getting markers:', error);
        throw error;
    }
};

// Удаляем маркер из таблицы
export const deleteMarker = async (db: SQLiteDatabase, id: string): Promise<void> => {
    try {
        // Благодаря ON DELETE CASCADE в схеме БД, изображения удалятся автоматически
        await db.runAsync(
            `DELETE FROM markers WHERE id = ?;`, 
            [id]
        );
    } catch (error) {
        console.error('Error deleting marker:', error);
        throw error;
    }
};

// Добавляем изображение в таблицу
export const addImage = async (db: SQLiteDatabase, marker_id: string, uri: string): Promise<string> => {
    try {
        const id = await generateUUID();
        await db.runAsync(
            `INSERT INTO marker_images (id, marker_id, uri) VALUES (?, ?, ?);`, [id, marker_id, uri]
        );
        return id;
    } catch (error) {
        console.error('Error adding image:', error);
        throw error;
    }
};

// Удаляем изображение из таблицы
export const deleteImage = async (db: SQLiteDatabase, id: string): Promise<void> => {
    try {
        await db.runAsync(
            `DELETE FROM marker_images WHERE id = ?;`, [id]
        );
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

// Получаем все изображение у маркера
export const getMarkerImages = async (db: SQLiteDatabase, marker_id: string): Promise<ImageData[]> => {
    try {
        const result = await db.getAllAsync<ImageData>(
            `SELECT * FROM marker_images WHERE marker_id = ?;`, [marker_id]
        );
        return result;
    } catch (error) {
        console.error('Error getting marker images:', error);
        throw error;
    }
};

// Получить маркер по id
export const getMarkerById = async (db: SQLiteDatabase, id: string): Promise<MarkerData> => {
    try {
        const result = await db.getFirstAsync<MarkerData>(
            'SELECT * FROM markers WHERE id = ?;',
            [id]
        );
        if (!result) {
            throw new Error('Marker not found');
        }
        return result;
    } catch (error) {
        console.error('Error getting marker:', error);
        throw error;
    }
};