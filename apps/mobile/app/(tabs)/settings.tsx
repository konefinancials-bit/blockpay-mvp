import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useMerchantStore } from '@/stores/merchant-store';
import { useRouter } from 'expo-router';

const C = { bg: '#0a0a0f', surface: '#12121a', border: '#1e1e2e', purple: '#6c63ff', text: '#fff', textSec: '#a0a0b0', textDim: '#606070', green: '#00e676', red: '#ff5252' };

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();
  const { merchant, updateWallets } = useMerchantStore();
  const router = useRouter();
  const [btcAddress, setBtcAddress] = useState(merchant?.wallets?.btc ?? '');
  const [ethAddress, setEthAddress] = useState(merchant?.wallets?.eth ?? '');
  const [solAddress, setSolAddress] = useState(merchant?.wallets?.sol ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateWallets(user.uid, { btc: btcAddress, eth: ethAddress, sol: solAddress, ...(merchant?.wallets ?? {}) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.title}>Settings</Text>

        {/* Profile card */}
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={{ color: C.purple, fontWeight: '700', fontSize: 20 }}>{merchant?.displayName?.[0]?.toUpperCase() ?? 'M'}</Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: C.text, fontWeight: '700' }}>{merchant?.displayName}</Text>
            <Text style={{ color: C.textDim, fontSize: 12 }}>{merchant?.email}</Text>
            <Text style={{ color: C.purple, fontSize: 11, fontWeight: '700', marginTop: 3, textTransform: 'capitalize' }}>
              {merchant?.plan ?? 'Starter'} Plan
            </Text>
          </View>
        </View>

        {/* Wallets */}
        <Text style={styles.section}>Wallet Addresses</Text>
        {[
          { label: '₿ Bitcoin (BTC)', value: btcAddress, set: setBtcAddress, placeholder: 'bc1q...' },
          { label: 'Ξ Ethereum (ETH)', value: ethAddress, set: setEthAddress, placeholder: '0x...' },
          { label: '◎ Solana (SOL)', value: solAddress, set: setSolAddress, placeholder: '...' },
        ].map(({ label, value, set, placeholder }) => (
          <View key={label} style={{ marginBottom: 12 }}>
            <Text style={{ color: C.textSec, fontSize: 12, marginBottom: 6, fontWeight: '600' }}>{label}</Text>
            <TextInput
              value={value} onChangeText={set} placeholder={placeholder}
              placeholderTextColor={C.textDim}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ))}

        <TouchableOpacity style={[styles.btn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          <Text style={styles.btnText}>{saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save Wallets'}</Text>
        </TouchableOpacity>

        {/* Sign out */}
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#ff525211', borderWidth: 1, borderColor: '#ff525233', marginTop: 16 }]} onPress={handleSignOut}>
          <Text style={[styles.btnText, { color: '#ff5252' }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 16 },
  card: { backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#6c63ff22', borderWidth: 1, borderColor: '#6c63ff44', alignItems: 'center', justifyContent: 'center' },
  section: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 12, marginTop: 4 },
  input: { backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 10, padding: 12, color: '#fff', fontSize: 13, fontFamily: 'monospace' },
  btn: { backgroundColor: '#6c63ff', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
