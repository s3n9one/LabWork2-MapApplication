import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MarkerData, ImageData } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import ImageList from '@/components/ImageList';
import { useDatabase } from '../../contexts/DatabaseContext';

export default function MarkerDetails() {
  // Получение параметров и зависимостей
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    getMarkerImages, 
    addImage, 
    deleteImage,
    getMarkerById,
    deleteMarker,
  } = useDatabase();

  // Состояния компонента
  const [marker, setMarker] = useState<MarkerData | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных маркера
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const [markerData, markerImages] = await Promise.all([
          getMarkerById(id),
          getMarkerImages(id)
        ]);
        
        setMarker(markerData);
        setImages(markerImages);
      } catch (error) {
        showError('Ошибка загрузки', 'Не удалось загрузить данные маркера');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Обработчики действий
  const handleAddImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled && id) {
        await addImage(id, result.assets[0].uri);
        refreshImages();
      }
    } catch (error) {
      showError('Ошибка выбора изображения', error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
    } catch (error) {
      showError('Ошибка удаления изображения', error);
    }
  };

  const handleDeleteMarker = () => {
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
              router.push({ pathname: '/', params: { refresh: Date.now() } });
            } catch (error) {
              showError('Ошибка удаления', 'Не удалось удалить маркер');
            }
          }
        }
      ]
    );
  };

  // Вспомогательные функции
  const refreshImages = async () => {
    if (!id) return;
    const updatedImages = await getMarkerImages(id);
    setImages(updatedImages);
  };

  const showError = (title: string, error: unknown) => {
    console.error(error);
    Alert.alert(title, String(error));
  };

  // Состояния загрузки
  if (isLoading) {
    return <LoadingView />;
  }

  if (!marker) {
    return <NotFoundView onBack={() => router.back()} />;
  }

  // Основная верстка
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Детали маркера</Text>
      <Text>Широта: {marker.latitude.toFixed(4)}</Text>
      <Text>Долгота: {marker.longitude.toFixed(4)}</Text>

      <View style={styles.buttonRow}>
        <Button title="Добавить изображение" onPress={handleAddImage} />
        <Button title="Удалить маркер" onPress={handleDeleteMarker} color="red" />
      </View>

      <ImageList images={images} onDelete={handleDeleteImage} />
      <Button title="Назад на карту" onPress={() => router.back()} />
    </View>
  );
}

// Компоненты состояний
const LoadingView = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" />
    <Text>Загрузка данных маркера...</Text>
  </View>
);

const NotFoundView = ({ onBack }: { onBack: () => void }) => (
  <View style={styles.center}>
    <Text>Маркер не найден</Text>
    <Button title="Назад" onPress={onBack} />
  </View>
);

// Стили
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