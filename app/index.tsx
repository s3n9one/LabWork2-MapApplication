import React, { useState } from 'react';
import { View } from 'react-native';
import Map from '../components/Map';
import { MarkerData } from '../types';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { LongPressEvent } from 'react-native-maps';
import { useRouter } from 'expo-router';

export default function Home() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const router = useRouter();

  const addMarker = (latitude: number, longitude: number) => {
    const newMarker: MarkerData = {
      id: uuidv4(),
      latitude,
      longitude,
      images: [],
    };
    setMarkers(prev => [...prev, newMarker]);
  };

  const updateMarker = (updatedMarker: MarkerData) => {
    setMarkers(prev =>
      prev.map(m => (m.id === updatedMarker.id ? updatedMarker : m))
    );
  };

  const handleLongPress = (event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    addMarker(latitude, longitude);
  };

  const handleMarkerPress = (markerId: string) => {
    router.push({
      pathname: '/marker/[id]',
      params: { id: markerId, markers: JSON.stringify(markers), updateMarker: JSON.stringify(updateMarker) },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Map markers={markers} onLongPress={handleLongPress} onMarkerPress={handleMarkerPress} />
    </View>
  );
}