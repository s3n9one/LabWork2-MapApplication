import React, { createContext, useContext, useEffect, useState } from 'react';
import { SQLiteDatabase } from 'expo-sqlite';
import { initDatabase } from '../database/schema';
import * as operations from '../database/operations';
import { MarkerData, DatabaseContextType } from '../types';

// Создаем контекст базы данных
const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState({
    db: null as SQLiteDatabase | null,
    error: null as Error | null,
    isLoading: true
  });

  // Инициализация базы данных
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await initDatabase();
        setState(prev => ({ ...prev, db: database, isLoading: false }));
      } catch (err) {
        setState(prev => ({ ...prev, error: err as Error, isLoading: false }));
      }
    };

    setupDatabase();
  }, []);

  // Проверка инициализации БД
  const checkDatabase = () => {
    if (!state.db) throw new Error('Database not initialized');
    return state.db;
  };

  // Методы работы с базой данных
  const databaseMethods = {
    addMarker: (latitude: number, longitude: number) => 
      operations.addMarker(checkDatabase(), latitude, longitude),
    
    deleteMarker: (id: string) => 
      operations.deleteMarker(checkDatabase(), id),
    
    getMarkers: () => 
      operations.getMarkers(checkDatabase()),
    
    addImage: (markerId: string, uri: string) => 
      operations.addImage(checkDatabase(), markerId, uri),
    
    deleteImage: (id: string) => 
      operations.deleteImage(checkDatabase(), id),
    
    getMarkerImages: (markerId: string) => 
      operations.getMarkerImages(checkDatabase(), markerId),
    
    getMarkerById: (id: string) => 
      operations.getMarkerById(checkDatabase(), id),
  };

  // Значение контекста
  const contextValue = {
    ...databaseMethods,
    isLoading: state.isLoading,
    error: state.error
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Хук для использования контекста
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};