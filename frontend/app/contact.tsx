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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Fallback contact data in case API fails
const FALLBACK_CONTACT = {
  phone: "07887 577338",
  email: "info@birchwood-skegness.co.uk",
  address: "Birchwood Fishing & Camping, Mill Lane, Skegness, Lincolnshire, PE25 1HW, UK",
  latitude: 53.16737,
  longitude: 0.31966,
  facebook: "https://www.facebook.com/share/1AiuyXLNeF/"
};

const FALLBACK_RULES = [
  { id: "rule_1", title: "Check-in/Check-out", description: "Check-in from 2 PM, Check-out by 11 AM", category: "general", order: 1 },
  { id: "rule_2", title: "Quiet Hours", description: "Please keep noise to a minimum between 10 PM and 8 AM", category: "general", order: 2 },
  { id: "rule_3", title: "Pets", description: "Pets are welcome but must be kept on a lead and under control at all times", category: "general", order: 3 },
  { id: "rule_4", title: "Speed Limit", description: "Maximum speed limit of 5 mph on site", category: "camping", order: 4 },
  { id: "rule_5", title: "Fires", description: "No open fires. BBQs allowed but must be off the ground", category: "camping", order: 5 },
  { id: "rule_6", title: "Waste Disposal", description: "Please use designated bins and keep the site clean", category: "general", order: 6 }
];

export default function ContactScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [contact, setContact] = useState<any>(FALLBACK_CONTACT);
  const [rules, setRules] = useState<any[]>(FALLBACK_RULES);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [contactRes, rulesRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/contact`),
        axios.get(`${BACKEND_URL}/api/rules`),
      ]);
      setContact(contactRes.data);
      setRules(rulesRes.data);
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
    if (contact?.phone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  };

  const handleEmail = () => {
    if (contact?.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };

  const handleDirections = () => {
    if (contact?.latitude && contact?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${contact.latitude},${contact.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleFacebook = () => {
    if (contact?.facebook) {
      Linking.openURL(contact.facebook);
    }
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
          <Ionicons name="call" size={60} color="#2d6a4f" />
          <Text style={styles.headerTitle}>Get in Touch</Text>
          <Text style={styles.headerSubtitle}>We're here to help</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleCall}>
              <View style={styles.actionIcon}>
                <Ionicons name="call" size={32} color="#ffffff" />
              </View>
              <Text style={styles.actionLabel}>Call Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleEmail}>
              <View style={styles.actionIcon}>
                <Ionicons name="mail" size={32} color="#ffffff" />
              </View>
              <Text style={styles.actionLabel}>Email Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleDirections}>
              <View style={styles.actionIcon}>
                <Ionicons name="navigate" size={32} color="#ffffff" />
              </View>
              <Text style={styles.actionLabel}>Directions</Text>
            </TouchableOpacity>

            {contact?.facebook && (
              <TouchableOpacity style={styles.actionCard} onPress={handleFacebook}>
                <View style={styles.actionIcon}>
                  <Ionicons name="logo-facebook" size={32} color="#ffffff" />
                </View>
                <Text style={styles.actionLabel}>Facebook</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Contact Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="call" size={24} color="#2d6a4f" />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{contact?.phone}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="mail" size={24} color="#2d6a4f" />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{contact?.email}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location" size={24} color="#2d6a4f" />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>{contact?.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location - Simple Button Instead of Map */}
        {contact?.latitude && contact?.longitude && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={64} color="#2d6a4f" />
              <Text style={styles.mapPlaceholderTitle}>Birchwood Fishing & Camping</Text>
              <Text style={styles.mapPlaceholderText}>Skegness, Lincolnshire</Text>
              <TouchableOpacity style={styles.directionsButton2} onPress={handleDirections}>
                <Ionicons name="navigate" size={20} color="#ffffff" />
                <Text style={styles.directionsButtonText}>Open in Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Site Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Site Rules & Guidelines</Text>
          <View style={styles.rulesCard}>
            {rules.map((rule, index) => (
              <View key={rule.id || index} style={styles.ruleItem}>
                <View style={styles.ruleIcon}>
                  <Ionicons name="shield-checkmark" size={20} color="#2d6a4f" />
                </View>
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleTitle}>{rule.title}</Text>
                  <Text style={styles.ruleDescription}>{rule.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Opening Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opening Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={24} color="#2d6a4f" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Check-in / Check-out</Text>
                <Text style={styles.infoText}>Check-in from 2:00 PM</Text>
                <Text style={styles.infoText}>Check-out by 11:00 AM</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={24} color="#2d6a4f" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Season</Text>
                <Text style={styles.infoText}>Open seasonally - contact us for availability</Text>
              </View>
            </View>
          </View>
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
    backgroundColor: '#95d5b2',
    padding: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#2d6a4f',
    marginTop: 4,
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2d6a4f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d6a4f',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  detailInfo: {
    flex: 1,
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#2d6a4f',
    fontWeight: '600',
  },
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 250,
  },
  mapPlaceholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginTop: 16,
    marginBottom: 4,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
  },
  directionsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d6a4f',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  directionsButton2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d6a4f',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  directionsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
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
  ruleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d8f3dc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleContent: {
    flex: 1,
    marginLeft: 12,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d6a4f',
    marginBottom: 4,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
});
