import React, { createContext, useContext, useEffect, useState } from 'react';
import { SQLiteDatabase } from 'expo-sqlite';
import { initDatabase } from '../database/schema';
import * as operations from '../database/operations';
import { MarkerData, ImageData, DatabaseContextType } from '../types';

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDb();

    return () => {
      // При необходимости можно закрыть соединение с БД
    };
  }, []);

  const contextValue: DatabaseContextType = {
    addMarker: async (latitude, longitude) => {
      if (!db) throw new Error('Database not initialized');
      return operations.addMarker(db, latitude, longitude);
    },
    deleteMarker: async (id: string) => {
      if (!db) throw new Error('Database not initialized');
      await operations.deleteMarker(db, id);
    },
    getMarkers: async () => {
      if (!db) throw new Error('Database not initialized');
      return operations.getMarkers(db);
    },
    addImage: async (markerId, uri) => {
      if (!db) throw new Error('Database not initialized');
      return operations.addImage(db, markerId, uri);
    },
    deleteImage: async (id) => {
      if (!db) throw new Error('Database not initialized');
      return operations.deleteImage(db, id);
    },
    getMarkerImages: async (markerId) => {
      if (!db) throw new Error('Database not initialized');
      return operations.getMarkerImages(db, markerId);
    },
    getMarkerById: async (id: string) => {
      if (!db) throw new Error('Database not initialized');
      const result = await db.getFirstAsync<MarkerData>(
        'SELECT * FROM markers WHERE id = ?;', 
        [id]
      );
      if (!result) throw new Error('Marker not found');
      return result;
    },
    isLoading,
    error,
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};