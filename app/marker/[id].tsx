import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, Alert, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MarkerData, ImageData, DatabaseContextType } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import ImageList from '@/components/ImageList';
import { useDatabase } from '../../contexts/DatabaseContext';

export default function MarkerDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    getMarkerImages, 
    addImage, 
    deleteImage,
    getMarkerById,
    deleteMarker,
    isLoading,
    error
  } = useDatabase();

  const [marker, setMarker] = useState<MarkerData | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarkerData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // 1. Загружаем данные маркера
        const markerData = await getMarkerById(id);
        setMarker(markerData);
        
        // 2. Загружаем изображения маркера
        const loadedImages = await getMarkerImages(id);
        setImages(loadedImages);
      } catch (error) {
        console.error('Error loading marker data:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить данные маркера');
      } finally {
        setLoading(false);
      }
    };

    loadMarkerData();
  }, [id]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled && id) {
        const uri = result.assets[0].uri;
        await addImage(id, uri);
        setImages(prev => [...prev, { id: '', uri }]); // Временное решение
        // Перезагружаем изображения
        const loadedImages = await getMarkerImages(id);
        setImages(loadedImages);
      }
    } catch (error) {
      Alert.alert('Ошибка выбора изображения', String(error));
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      Alert.alert('Ошибка удаления изображения', String(error));
    }
  };

  const handleDeleteMarker = async () => {
    if (!id) return;
    
    Alert.alert(
      'Удаление маркера',
      'Вы уверены, что хотите удалить этот маркер и все его изображения?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMarker(id);
              // Возвращаемся на карту с флагом обновления
              router.push({
                pathname: '/',
                params: { refresh: Date.now() } // Уникальное значение для триггера
              });
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить маркер');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Загрузка данных маркера...</Text>
      </View>
    );
  }

  if (!marker) {
    return (
      <View style={styles.center}>
        <Text>Маркер не найден</Text>
        <Button title="Назад" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Детали маркера</Text>
      <Text>Широта: {marker?.latitude.toFixed(4)}</Text>
      <Text>Долгота: {marker?.longitude.toFixed(4)}</Text>

      <View style={styles.buttonRow}>
        <Button title="Добавить изображение" onPress={pickImage} />
        <Button 
          title="Удалить маркер" 
          onPress={handleDeleteMarker} 
          color="red" 
        />
      </View>

      <ImageList images={images} onDelete={handleDeleteImage} />

      <Button title="Назад на карту" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginVertical: 16 
  },
});