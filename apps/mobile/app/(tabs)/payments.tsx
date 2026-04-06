import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useMerchantStore, Payment } from '@/stores/merchant-store';
import { useAuthStore } from '@/stores/auth-store';

const C = { bg: '#0a0a0f', surface: '#12121a', border: '#1e1e2e', purple: '#6c63ff', text: '#fff', textSec: '#a0a0b0', textDim: '#606070' };
const STATUS_COLOR: Record<string, string> = { confirmed: '#00e676', finished: '#00e676', waiting: '#ffb300', confirming: '#00e5ff', failed: '#ff5252', expired: '#606070' };
const FILTERS = ['all', 'confirmed', 'waiting', 'failed'];

export default function PaymentsScreen() {
  const { payments, fetchPayments } = useMerchantStore();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    await fetchPayments(user.uid);
    setRefreshing(false);
  }, [user]);

  const filtered = payments.filter((p) => filter === 'all' || p.status === filter);

  const renderItem = ({ item }: { item: Payment }) => (
    <View style={styles.row}>
      <View style={[styles.coinBadge, { backgroundColor: '#6c63ff22' }]}>
        <Text style={{ color: '#6c63ff', fontWeight: '700', fontSize: 12 }}>{item.payCurrency.slice(0, 3).toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.orderId} numberOfLines={1}>{item.orderId}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.amount}>${item.priceAmount.toFixed(2)}</Text>
        <Text style={[styles.status, { color: STATUS_COLOR[item.status] ?? C.textDim }]}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>Payments</Text>
        {/* Filter chips */}
        <View style={styles.filters}>
          {FILTERS.map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.chip, filter === f && styles.chipActive]}>
              <Text style={[styles.chipText, filter === f && { color: '#fff' }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        ListEmptyComponent={<Text style={{ color: C.textDim, textAlign: 'center', marginTop: 40 }}>No payments found</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.purple} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  filters: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#1e1e2e', backgroundColor: '#12121a' },
  chipActive: { backgroundColor: '#6c63ff', borderColor: '#6c63ff' },
  chipText: { color: '#a0a0b0', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 12, padding: 14, marginBottom: 8 },
  coinBadge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  orderId: { color: '#fff', fontWeight: '600', fontSize: 13 },
  date: { color: '#606070', fontSize: 11, marginTop: 2 },
  amount: { color: '#fff', fontWeight: '700', fontSize: 14 },
  status: { fontSize: 11, fontWeight: '600', marginTop: 2, textTransform: 'capitalize' },
});
