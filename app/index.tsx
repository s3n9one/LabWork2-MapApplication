import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Map from '../components/Map';
import { MarkerData } from '../types';
import { LongPressEvent } from 'react-native-maps';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDatabase } from '../contexts/DatabaseContext';

export default function Home() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const router = useRouter();
  const { addMarker, getMarkers, isLoading, error } = useDatabase();

  // Загрузка маркеров
  const loadMarkers = useCallback(async () => {
    try {
      const loadedMarkers = await getMarkers();
      setMarkers(loadedMarkers.map(marker => ({ ...marker, images: [] })));
    } catch (err) {
      console.error('Ошибка загрузки маркеров:', err);
    }
  }, [getMarkers]);

  // Обновляем маркеры при фокусе и изменении состояния загрузки
  useFocusEffect(useCallback(() => {
    if (!isLoading) loadMarkers();
  }, [isLoading, loadMarkers]));

  // Обработка длинного нажатия на карту
  const handleLongPress = async (event: LongPressEvent) => {
    if (isLoading) return;
    
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      const markerId = await addMarker(latitude, longitude);
      setMarkers(prev => [...prev, { id: markerId, latitude, longitude, images: [] }]);
    } catch (err) {
      console.error('Ошибка добавления маркера:', err);
    }
  };

  // Переход к деталям маркера
  const handleMarkerPress = (markerId: string) => {
    router.push({ pathname: '/marker/[id]', params: { id: markerId } });
  };

  // Основной интерфейс
  return (
    <View style={{ flex: 1 }}>
      <Map 
        markers={markers} 
        onLongPress={handleLongPress} 
        onMarkerPress={handleMarkerPress} 
      />
    </View>
  );
}

const styles = {
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  error: { 
    color: 'red' 
  }
};