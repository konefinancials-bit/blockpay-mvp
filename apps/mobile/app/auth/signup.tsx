import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth-store';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, loading } = useAuthStore();
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !businessName) { Alert.alert('Fill in all fields'); return; }
    if (password.length < 6) { Alert.alert('Password must be at least 6 characters'); return; }
    try {
      await signUp(name, email, password, businessName);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start accepting crypto in minutes</Text>

          {[
            { label: 'Your name', value: name, set: setName, placeholder: 'Keilan Robinson', opts: {} },
            { label: 'Business name', value: businessName, set: setBusinessName, placeholder: 'Your Café', opts: {} },
            { label: 'Email', value: email, set: setEmail, placeholder: 'you@example.com', opts: { keyboardType: 'email-address' as const, autoCapitalize: 'none' as const } },
            { label: 'Password', value: password, set: setPassword, placeholder: '••••••••', opts: { secureTextEntry: true } },
          ].map(({ label, value, set, placeholder, opts }) => (
            <View key={label} style={{ marginBottom: 12 }}>
              <Text style={{ color: '#a0a0b0', fontSize: 12, marginBottom: 6, fontWeight: '600' }}>{label}</Text>
              <TextInput placeholder={placeholder} value={value} onChangeText={set} style={styles.input} placeholderTextColor="#606070" {...opts} />
            </View>
          ))}

          <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleSignup} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Creating...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <Link href="/auth/login" style={styles.link}>Already have an account? Sign in</Link>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 6 },
  subtitle: { color: '#a0a0b0', fontSize: 14, marginBottom: 24 },
  input: { backgroundColor: '#12121a', borderWidth: 1, borderColor: '#1e1e2e', borderRadius: 12, padding: 16, color: '#fff', fontSize: 15 },
  btn: { backgroundColor: '#6c63ff', borderRadius: 12, padding: 17, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: '#6c63ff', textAlign: 'center', marginTop: 20, fontSize: 14 },
});
