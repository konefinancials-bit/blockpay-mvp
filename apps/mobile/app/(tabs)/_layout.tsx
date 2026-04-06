import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#12121a', borderTopColor: '#1e1e2e' },
      tabBarActiveTintColor: '#6c63ff',
      tabBarInactiveTintColor: '#606070',
    }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="charge" options={{ title: 'Charge', tabBarIcon: ({ color }) => <Ionicons name="flash-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="payments" options={{ title: 'Payments', tabBarIcon: ({ color }) => <Ionicons name="card-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} /> }} />
    </Tabs>
  );
}
