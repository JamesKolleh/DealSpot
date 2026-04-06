import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Deal } from '../types';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [postedDeals, setPostedDeals] = useState<Deal[]>([]);

  useEffect(() => {
    if (!user) return;
    const favQuery = query(collection(db, 'favorites'), where('userId', '==', user.uid));
    const unsubscribeFav = onSnapshot(favQuery, (snapshot) => setFavoritesCount(snapshot.size));

    const dealsQuery = query(collection(db, 'deals'), where('createdBy', '==', user.uid));
    const unsubscribeDeals = onSnapshot(dealsQuery, (snapshot) => {
      setPostedDeals(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })));
    });

    return () => {
      unsubscribeFav();
      unsubscribeDeals();
    };
  }, [user]);

  const handleDelete = async (dealId: string) => {
    Alert.alert('Delete deal', 'Are you sure you want to remove this deal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'deals', dealId));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>{user?.role === 'business' ? 'Business account' : 'Customer account'}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{favoritesCount}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        {user?.role === 'business' && (
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{postedDeals.length}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My deals</Text>
        {user?.role === 'business' ? (
          postedDeals.length ? (
            <FlatList
              data={postedDeals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.dealRow}>
                  <View>
                    <Text style={styles.dealTitle}>{item.title}</Text>
                    <Text style={styles.dealMeta}>{item.discount} • {item.location}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>You have not posted any deals yet.</Text>
          )
        ) : (
          <Text style={styles.emptyText}>Switch to a business account to post and manage deals.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F6F8FB',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  email: {
    color: '#666',
    marginBottom: 8,
  },
  role: {
    color: '#0A84FF',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    color: '#666',
    marginTop: 6,
  },
  section: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  dealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  dealMeta: {
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#B91C1C',
    fontWeight: '700',
  },
  emptyText: {
    color: '#666',
    lineHeight: 22,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ProfileScreen;
