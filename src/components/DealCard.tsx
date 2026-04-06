import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, isFavorite, onPress, onFavoritePress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.discount}>{deal.discount}</Text>
        <Pressable onPress={onFavoritePress} hitSlop={8}>
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? '#FF3B30' : '#666'} />
        </Pressable>
      </View>
      <Text style={styles.title}>{deal.title}</Text>
      <Text numberOfLines={2} style={styles.description}>{deal.description}</Text>
      <View style={styles.bottomRow}>
        <Text style={styles.category}>{deal.category}</Text>
        <Text style={styles.location}>{deal.location}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discount: {
    color: '#0A84FF',
    fontWeight: '700',
    fontSize: 16,
  },
  title: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  bottomRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    color: '#333',
    fontWeight: '600',
  },
  location: {
    color: '#888',
  },
});

export default DealCard;
