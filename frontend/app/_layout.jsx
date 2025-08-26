'use client';

import { useEffect, useState } from 'react';
import { useRouter, Stack, Slot, usePathname } from 'expo-router';
import { UserProvider, useUser } from './context/usercontext';
import { Text } from 'react-native';


function RootGuard({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !user && pathname !== '/login' && pathname !== '/register') {
      router.replace('/login');
    }
  }, [mounted, user, pathname]);

  if (!mounted) return <Text>Cargando...</Text>;

  return user || pathname === '/login' || pathname === '/register' ? children : null;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <RootGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </RootGuard>
    </UserProvider>
  );
}
