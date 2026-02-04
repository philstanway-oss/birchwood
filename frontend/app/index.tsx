import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// HARDCODED CONTACT INFO - ALWAYS AVAILABLE
const CONTACT_PHONE = "07887 577338";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [contact, setContact] = useState<any>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/contact`);
      setContact(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleCall = () => {
    Linking.openURL(`tel:${CONTACT_PHONE}`);
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
        {/* Hero Section with Logo */}
        <View style={styles.hero}>
          <View style={styles.heroOverlay}>
            <Image
              source={require('../assets/images/birchwood-logo.jpg')}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <Text style={styles.heroTagline}>Your peaceful retreat near Skegness</Text>
          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Welcome</Text>
          <Text style={styles.welcomeText}>
            Welcome to Birchwood Fishing & Camping, a quiet family-run campsite near Skegness,
            Lincolnshire. Just a short drive from the beach and local attractions, we offer a
            peaceful environment perfect for families and pet owners.
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Ionicons name="bed" size={40} color="#2d6a4f" />
              <Text style={styles.featureTitle}>Camping</Text>
              <Text style={styles.featureText}>Pitches for tents, tourers & motorhomes</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="fish" size={40} color="#2d6a4f" />
              <Text style={styles.featureTitle}>Fishing</Text>
              <Text style={styles.featureText}>Well-stocked course fishing lake</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="paw" size={40} color="#2d6a4f" />
              <Text style={styles.featureTitle}>Pet Friendly</Text>
              <Text style={styles.featureText}>Bring your furry friends along</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="people" size={40} color="#2d6a4f" />
              <Text style={styles.featureTitle}>Family Run</Text>
              <Text style={styles.featureText}>Friendly & welcoming atmosphere</Text>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <Ionicons name="location" size={32} color="#2d6a4f" style={styles.locationIcon} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>Just outside Skegness</Text>
              <Text style={styles.locationSubtext}>Short drive to beach & attractions</Text>
              <Text style={styles.locationSubtext}>Peaceful countryside setting</Text>
            </View>
          </View>
        </View>

        {/* Quick Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={24} color="#ffffff" />
            <Text style={styles.callButtonText}>Call Us Now</Text>
          </TouchableOpacity>
          <Text style={styles.contactNote}>
            Or visit the Contact tab for more information
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Birchwood Fishing & Camping
          </Text>
          <Text style={styles.footerText}>Skegness, Lincolnshire</Text>
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
  },
  hero: {
    height: 280,
    backgroundColor: '#2d6a4f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    alignItems: 'center',
    padding: 24,
    width: '100%',
  },
  heroLogo: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#d8f3dc',
    marginTop: 8,
    fontWeight: '600',
  },
  heroTagline: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 160,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginTop: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  locationCard: {
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
  locationIcon: {
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 8,
  },
  locationSubtext: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  callButton: {
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
  callButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  contactNote: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 12,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
});
