import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useRouter } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function FishingScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fishingInfo, setFishingInfo] = useState<any>(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/fishing`);
      setFishingInfo(response.data);
    } catch (error) {
      console.error('Error fetching fishing info:', error);
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
          <Ionicons name="fish" size={60} color="#2d6a4f" />
          <Text style={styles.headerTitle}>{fishingInfo?.title || 'Fishing'}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>{fishingInfo?.description}</Text>
        </View>

        {/* Species */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fish Species</Text>
          <View style={styles.speciesGrid}>
            {fishingInfo?.species?.map((species: string, index: number) => (
              <View key={index} style={styles.speciesCard}>
                <Ionicons name="fish" size={32} color="#2d6a4f" />
                <Text style={styles.speciesText}>{species}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Day Tickets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Day Tickets</Text>
          <View style={styles.ticketCard}>
            <View style={styles.ticketIcon}>
              <Ionicons name="ticket" size={40} color="#2d6a4f" />
            </View>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketTitle}>Day Fishing Passes</Text>
              <Text style={styles.ticketPrice}>{fishingInfo?.dayTicketPrice}</Text>
              <Text style={styles.ticketNote}>Purchase tickets before fishing</Text>
            </View>
          </View>
        </View>

        {/* Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fishing Rules</Text>
          <View style={styles.rulesCard}>
            {fishingInfo?.rules?.map((rule: string, index: number) => (
              <View key={index} style={styles.ruleItem}>
                <View style={styles.ruleNumber}>
                  <Text style={styles.ruleNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.section}>
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={28} color="#2d6a4f" />
            <Text style={styles.infoBannerText}>
              Please respect the lake and wildlife. Follow catch and release guidelines to
              maintain our fishing quality for everyone.
            </Text>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => router.push('/contact')}
          >
            <Ionicons name="call" size={24} color="#ffffff" />
            <Text style={styles.contactButtonText}>Contact for Day Tickets</Text>
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
    backgroundColor: '#b7e4c7',
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
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  speciesCard: {
    width: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 110,
    justifyContent: 'center',
  },
  speciesText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d6a4f',
    marginTop: 8,
    textAlign: 'center',
  },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketIcon: {
    marginRight: 16,
    justifyContent: 'center',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 4,
  },
  ticketPrice: {
    fontSize: 16,
    color: '#52b788',
    fontWeight: '600',
    marginBottom: 4,
  },
  ticketNote: {
    fontSize: 14,
    color: '#6c757d',
  },
  rulesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  ruleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d8f3dc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ruleNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  ruleText: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
    lineHeight: 22,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#d8f3dc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoBannerText: {
    fontSize: 14,
    color: '#2d6a4f',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
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
