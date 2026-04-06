import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Fill in all fields'); return; }
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>⚡</Text>
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your BlockPay account</Text>

        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor="#606070" keyboardType="email-address" autoCapitalize="none" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} placeholderTextColor="#606070" secureTextEntry />

        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <Link href="/auth/signup" style={styles.link}>Don't have an account? Sign up</Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  logo: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#6c63ff', alignItems: 'center', justifyContent: 'center', marginBottom: 24, alignSelf: 'center' },
  logoText: { fontSize: 28 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 6 },
  subtitle: { color: '#a0a0b0', fontSize: 14, marginBottom: 28 },
  input: { backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 12, padding: 16, color: '#fff', fontSize: 15, marginBottom: 12 },
  btn: { backgroundColor: '#6c63ff', borderRadius: 12, padding: 17, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: '#6c63ff', textAlign: 'center', marginTop: 20, fontSize: 14 },
});
