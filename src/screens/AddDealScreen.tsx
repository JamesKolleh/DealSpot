import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DEAL_CATEGORIES } from '../constants/categories';
import { useAuth } from '../context/AuthContext';

const AddDealScreen = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [location, setLocation] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState(DEAL_CATEGORIES[0]);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location denied', 'Grant location permission to attach a deal location.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(`${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`);
    } catch (error: any) {
      Alert.alert('Location error', error.message || 'Unable to fetch current position.');
    }
  };

  const handleCreate = async () => {
    if (!user) {
      Alert.alert('Authentication', 'Sign in with a business account to post deals.');
      return;
    }

    if (user.role !== 'business') {
      Alert.alert('Business access', 'Only business accounts can post deals.');
      return;
    }

    if (!title || !description || !discount || !location || !expiryDate) {
      Alert.alert('Validation', 'Please complete all fields.');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'deals'), {
        title,
        description,
        discount,
        location,
        category,
        featured,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        expiryDate: Timestamp.fromDate(new Date(expiryDate)),
        redeemedCount: 0,
      });
      Alert.alert('Deal created', 'Your deal is now live for nearby shoppers.');
      setTitle('');
      setDescription('');
      setDiscount('');
      setLocation('');
      setExpiryDate('');
      setFeatured(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unable to create deal.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'business') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Business access required</Text>
        <Text style={styles.emptyText}>Only business accounts can post and manage deals. Please sign up as a business.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create a new local deal</Text>
      <TextInput style={styles.input} placeholder="Deal title" placeholderTextColor="#999" value={title} onChangeText={setTitle} />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Description" placeholderTextColor="#999" multiline value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Discount (e.g. 20% off)" placeholderTextColor="#999" value={discount} onChangeText={setDiscount} />
      <TextInput style={styles.input} placeholder="Location" placeholderTextColor="#999" value={location} onChangeText={setLocation} />
      <TouchableOpacity style={styles.smallButton} onPress={fetchCurrentLocation}>
        <Text style={styles.smallButtonText}>Use current location</Text>
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Expiry date (YYYY-MM-DD)" placeholderTextColor="#999" value={expiryDate} onChangeText={setExpiryDate} />
      <View style={styles.toggleRow}>
        <Text style={styles.optionLabel}>Category</Text>
        <Text style={styles.optionValue}>{category}</Text>
      </View>
      <View style={styles.categoryRow}>
        {DEAL_CATEGORIES.map((item) => (
          <TouchableOpacity key={item} style={[styles.categoryChip, category === item && styles.categoryChipActive]} onPress={() => setCategory(item)}>
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.toggleRow}>
        <Text style={styles.optionLabel}>Featured deal</Text>
        <TouchableOpacity onPress={() => setFeatured(!featured)} style={[styles.featuredSwitch, featured && styles.featuredSwitchActive]}>
          <Text style={styles.featuredSwitchText}>{featured ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Posting deal...' : 'Post deal'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  smallButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#0A84FF',
    borderRadius: 14,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionValue: {
    color: '#666',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
    marginBottom: 10,
  },
  categoryChipActive: {
    backgroundColor: '#0A84FF',
    borderColor: '#0A84FF',
  },
  categoryText: {
    color: '#111',
  },
  categoryTextActive: {
    color: '#fff',
  },
  featuredSwitch: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
  },
  featuredSwitchActive: {
    backgroundColor: '#0A84FF',
  },
  featuredSwitchText: {
    color: '#111',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#0A84FF',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F6F8FB',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default AddDealScreen;
