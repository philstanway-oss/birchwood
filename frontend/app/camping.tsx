import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useRouter } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const PITCHUP_URL = 'https://www.pitchup.com/campsites/England/Central/Lincolnshire/Skegness/birchwood-fishing-and-camping/';

export default function CampingScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [campingInfo, setCampingInfo] = useState<any>(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/camping`);
      setCampingInfo(response.data);
    } catch (error) {
      console.error('Error fetching camping info:', error);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d6a4f" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2d6a4f']} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="tent" size={60} color="#2d6a4f" />
          <Text style={styles.headerTitle}>{campingInfo?.title || 'Camping'}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>{campingInfo?.description}</Text>
        </View>

        {/* Pitch Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pitch Types</Text>
          <View style={styles.card}>
            {campingInfo?.pitchTypes?.map((pitch: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={20} color="#52b788" />
                <Text style={styles.listText}>{pitch}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Facilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.facilitiesGrid}>
            {campingInfo?.facilities?.map((facility: string, index: number) => (
              <View key={index} style={styles.facilityCard}>
                <Ionicons name="checkmark-done" size={24} color="#2d6a4f" />
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingCard}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Tent Pitches:</Text>
              <Text style={styles.pricingValue}>{campingInfo?.pricing?.tent}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Tourer Pitches:</Text>
              <Text style={styles.pricingValue}>{campingInfo?.pricing?.tourer}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Motorhome Pitches:</Text>
              <Text style={styles.pricingValue}>{campingInfo?.pricing?.motorhome}</Text>
            </View>
            {campingInfo?.pricing?.note && (
              <View style={styles.pricingNote}>
                <Ionicons name="information-circle" size={20} color="#2d6a4f" />
                <Text style={styles.pricingNoteText}>{campingInfo.pricing.note}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => router.push('/contact')}
          >
            <Ionicons name="call" size={24} color="#ffffff" />
            <Text style={styles.contactButtonText}>Contact Us for Booking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#d8f3dc',
    padding: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginTop: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  listText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 12,
    flex: 1,
  },
  facilitiesGrid: {
    gap: 12,
  },
  facilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facilityText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 12,
    flex: 1,
  },
  pricingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  pricingLabel: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  pricingValue: {
    fontSize: 16,
    color: '#2d6a4f',
    fontWeight: 'bold',
  },
  pricingNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#d8f3dc',
    borderRadius: 8,
  },
  pricingNoteText: {
    fontSize: 14,
    color: '#2d6a4f',
    marginLeft: 8,
    flex: 1,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#2d6a4f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
});
