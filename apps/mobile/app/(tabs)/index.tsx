import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useMerchantStore } from '@/stores/merchant-store';
import { useRouter } from 'expo-router';

const C = { bg: '#0a0a0f', surface: '#12121a', border: '#1e1e2e', purple: '#6c63ff', cyan: '#00e5ff', green: '#00e676', text: '#fff', textSec: '#a0a0b0', textDim: '#606070' };

export default function DashboardScreen() {
  const { user, initialized } = useAuthStore();
  const { merchant, payments, fetchMerchant, fetchPayments } = useMerchantStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (initialized && !user) router.replace('/auth/login');
    if (user) { fetchMerchant(user.uid); fetchPayments(user.uid); }
  }, [user, initialized]);

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    await Promise.all([fetchMerchant(user.uid), fetchPayments(user.uid)]);
    setRefreshing(false);
  }, [user]);

  const today = new Date().toDateString();
  const todayPayments = payments.filter((p) => new Date(p.createdAt).toDateString() === today);
  const todayVolume = todayPayments.filter((p) => ['confirmed', 'finished'].includes(p.status)).reduce((s, p) => s + p.priceAmount, 0);
  const totalVolume = payments.filter((p) => ['confirmed', 'finished'].includes(p.status)).reduce((s, p) => s + p.priceAmount, 0);
  const recent = payments.slice(0, 5);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.purple} />}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'} 👋</Text>
            <Text style={styles.biz}>{merchant?.businessName ?? 'Your Business'}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={{ color: C.purple, fontWeight: '700' }}>{merchant?.displayName?.[0]?.toUpperCase() ?? 'M'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.statLabel}>Today's Volume</Text>
            <Text style={[styles.statValue, { color: C.green }]}>${todayVolume.toFixed(2)}</Text>
          </View>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statLabel}>Payments</Text>
            <Text style={[styles.statValue, { color: C.cyan }]}>{todayPayments.length}</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>All-time Volume</Text>
          <Text style={[styles.statValue, { color: C.purple }]}>${totalVolume.toFixed(2)}</Text>
        </View>

        {/* Recent payments */}
        <Text style={styles.sectionTitle}>Recent Payments</Text>
        {recent.length === 0 ? (
          <View style={[styles.card, { alignItems: 'center', paddingVertical: 32 }]}>
            <Text style={{ color: C.textDim, fontSize: 13 }}>No payments yet. Tap Charge to get started.</Text>
          </View>
        ) : (
          recent.map((p) => (
            <View key={p.id} style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.text, fontWeight: '600', fontSize: 13 }}>{p.payCurrency.toUpperCase()}</Text>
                <Text style={{ color: C.textDim, fontSize: 11 }}>{new Date(p.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: C.text, fontWeight: '700' }}>${p.priceAmount.toFixed(2)}</Text>
                <Text style={{ color: STATUS_COLOR[p.status] ?? C.textDim, fontSize: 11, fontWeight: '600' }}>{p.status}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const STATUS_COLOR: Record<string, string> = {
  confirmed: '#00e676', finished: '#00e676', waiting: '#ffb300', confirming: '#00e5ff', failed: '#ff5252', expired: '#606070',
};

const styles = StyleSheet.create({
  scroll: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  greeting: { color: '#a0a0b0', fontSize: 14 },
  biz: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6c63ff22', borderWidth: 1, borderColor: '#6c63ff44', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', marginBottom: 8 },
  statCard: { backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 14, padding: 16, marginBottom: 8 },
  statLabel: { color: '#a0a0b0', fontSize: 12, marginBottom: 6 },
  statValue: { fontSize: 24, fontWeight: '900' },
  sectionTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginTop: 16, marginBottom: 10 },
  card: { backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 12, padding: 14 },
});
