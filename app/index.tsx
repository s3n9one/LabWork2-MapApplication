import React, { useState, useEffect, useCallback  } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Map from '../components/Map';
import { MarkerData } from '../types';
import { LongPressEvent } from 'react-native-maps';
import { useRouter, useFocusEffect  } from 'expo-router';
import { useDatabase } from '../contexts/DatabaseContext';

export default function Home() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const router = useRouter();
  const { addMarker, getMarkers, isLoading, error } = useDatabase();

  const loadMarkers = useCallback(async () => {
    try {
      const loadedMarkers = await getMarkers();
      setMarkers(loadedMarkers.map(m => ({ ...m, images: [] })));
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  }, [getMarkers]);

  // Обновляем при каждом открытии экрана
  useFocusEffect(
    useCallback(() => {
      loadMarkers();
    }, [loadMarkers])
  );

  useEffect(() => {
    if (isLoading) return; // Не загружаем маркеры, пока БД не готова

    const loadMarkers = async () => {
      try {
        const loadedMarkers = await getMarkers();
        const markersWithImages = loadedMarkers.map(marker => ({
          ...marker,
          images: []
        }));
        setMarkers(markersWithImages);
      } catch (error) {
        console.error('Error loading markers:', error);
      }
    };

    loadMarkers();
  }, [isLoading]); // Зависимость от isLoading

  const handleLongPress = async (event: LongPressEvent) => {
    if (isLoading) return;
    
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      const markerId = await addMarker(latitude, longitude);
      setMarkers(prev => [...prev, {
        id: markerId,
        latitude,
        longitude,
        images: []
      }]);
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  const handleMarkerPress = (markerId: string) => {
    router.push({
      pathname: '/marker/[id]',
      params: { id: markerId },
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Инициализация базы данных...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Ошибка инициализации базы данных</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Map markers={markers} onLongPress={handleLongPress} onMarkerPress={handleMarkerPress} />
    </View>
  );
}