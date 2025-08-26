// app/_layout.jsx
'use client';

import { UserProvider } from './context/usercontext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </UserProvider>
  );
}
