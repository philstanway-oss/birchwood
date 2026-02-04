import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/gallery`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      // Set empty array if no images yet
      setImages([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const openImage = (image: any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const filteredImages =
    selectedCategory === 'all'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const categories = [
    { key: 'all', label: 'All', icon: 'images' },
    { key: 'camping', label: 'Camping', icon: 'tent' },
    { key: 'fishing', label: 'Fishing', icon: 'fish' },
    { key: 'facilities', label: 'Facilities', icon: 'business' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d6a4f" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryButton,
              selectedCategory === cat.key && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Ionicons
              name={cat.icon as any}
              size={20}
              color={selectedCategory === cat.key ? '#ffffff' : '#2d6a4f'}
            />
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat.key && styles.categoryButtonTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Gallery Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2d6a4f']} />
        }
      >
        {filteredImages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={80} color="#b7e4c7" />
            <Text style={styles.emptyTitle}>No Images Yet</Text>
            <Text style={styles.emptyText}>
              The gallery is being updated with beautiful photos of our campsite, fishing lake, and
              facilities. Check back soon!
            </Text>
            <View style={styles.comingSoonBadge}>
              <Ionicons name="time" size={20} color="#2d6a4f" />
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredImages.map((image, index) => (
              <TouchableOpacity
                key={image.id || index}
                style={styles.imageCard}
                onPress={() => openImage(image)}
              >
                <Image
                  source={{ uri: image.imageData }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageTitle} numberOfLines={1}>
                    {image.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Image Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeImage}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={closeImage} />
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeImage}>
              <Ionicons name="close-circle" size={36} color="#ffffff" />
            </TouchableOpacity>
            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage.imageData }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalTitle}>{selectedImage.title}</Text>
                  {selectedImage.description && (
                    <Text style={styles.modalDescription}>{selectedImage.description}</Text>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  categoryContent: {
    padding: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#d8f3dc',
    borderWidth: 2,
    borderColor: '#d8f3dc',
  },
  categoryButtonActive: {
    backgroundColor: '#2d6a4f',
    borderColor: '#2d6a4f',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d6a4f',
    marginLeft: 8,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d8f3dc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 24,
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d6a4f',
    marginLeft: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  imageCard: {
    width: (width - 44) / 2,
    height: (width - 44) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: -50,
    right: 0,
    zIndex: 10,
  },
  modalImage: {
    width: '100%',
    height: 400,
  },
  modalInfo: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 22,
  },
});
