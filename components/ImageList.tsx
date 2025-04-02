import React from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ImageData } from '../types';

interface ImageListProps {
  images: ImageData[];
  onDelete: (id: string) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onDelete }) => {
  if (images.length === 0) {
    return <Text style={styles.emptyText}>Нет изображений</Text>;
  }

  return (
    <FlatList
      data={images}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Text style={styles.deleteText}>Удалить</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  image: { width: 100, height: 100, marginRight: 16 },
  deleteText: { color: 'red' },
  emptyText: { fontStyle: 'italic', marginVertical: 16 },
});

export default ImageList;
