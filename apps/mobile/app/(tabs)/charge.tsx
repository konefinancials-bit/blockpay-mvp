import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api';

const C = { bg: '#0a0a0f', surface: '#12121a', border: '#1e1e2e', purple: '#6c63ff', cyan: '#00e5ff', green: '#00e676', text: '#fff', textSec: '#a0a0b0', textDim: '#606070' };

const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];

export default function ChargeScreen() {
  const { user } = useAuthStore();
  const [display, setDisplay] = useState('0');
  const [creating, setCreating] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleKey = (key: string) => {
    if (status) { setStatus(''); setPaymentUrl(''); }
    setDisplay((prev) => {
      if (key === '⌫') return prev.length > 1 ? prev.slice(0, -1) : '0';
      if (key === '.' && prev.includes('.')) return prev;
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  };

  const handleCharge = async () => {
    const amount = parseFloat(display);
    if (!amount || amount <= 0) { Alert.alert('Enter an amount'); return; }
    if (!user) { Alert.alert('Please sign in'); return; }
    setCreating(true);
    try {
      const appUrl = process.env.EXPO_PUBLIC_API_URL ?? 'https://blockpay.live';
      const url = `${appUrl}/pay/${user.uid}?amount=${amount}`;
      setPaymentUrl(url);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setCreating(false);
    }
  };

  const openLink = () => { if (paymentUrl) Linking.openURL(paymentUrl); };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <Text style={styles.title}>Charge Customer</Text>

        {/* Amount display */}
        <View style={styles.amountBox}>
          <Text style={styles.amountText}>${display}</Text>
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          {KEYS.map((k) => (
            <TouchableOpacity key={k} style={styles.key} onPress={() => handleKey(k)}>
              <Text style={styles.keyText}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Charge button */}
        {!paymentUrl ? (
          <TouchableOpacity style={[styles.chargeBtn, creating && { opacity: 0.6 }]} onPress={handleCharge} disabled={creating}>
            <Text style={styles.chargeBtnText}>{creating ? 'Creating...' : 'Generate Payment Link'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.paymentCard}>
            <Text style={{ color: C.textDim, fontSize: 12, marginBottom: 8 }}>Share this link with customer:</Text>
            <Text style={[styles.urlText, { color: C.cyan }]} numberOfLines={3}>{paymentUrl}</Text>
            <TouchableOpacity style={[styles.chargeBtn, { marginTop: 12, backgroundColor: C.cyan + '22', borderWidth: 1, borderColor: C.cyan + '44' }]} onPress={openLink}>
              <Text style={[styles.chargeBtnText, { color: C.cyan }]}>Open Payment Page</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setPaymentUrl(''); setDisplay('0'); }} style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: C.textDim, fontSize: 13 }}>← New charge</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 20 },
  amountBox: { backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 },
  amountText: { color: '#fff', fontSize: 48, fontWeight: '900' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  key: { width: '30%', aspectRatio: 2, backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  keyText: { color: '#fff', fontSize: 22, fontWeight: '600' },
  chargeBtn: { backgroundColor: '#6c63ff', borderRadius: 14, padding: 16, alignItems: 'center' },
  chargeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  paymentCard: { backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 16, padding: 16 },
  urlText: { fontFamily: 'monospace', fontSize: 12, lineHeight: 18 },
});
