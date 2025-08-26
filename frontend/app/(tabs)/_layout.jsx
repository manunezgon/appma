// app/(tabs)/_layout.jsx
'use client';

import { Stack } from 'expo-router';
import RootGuard from '../RootGuard';

export default function TabsLayout() {
  return (
    <RootGuard>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Inicio' }} />
        <Stack.Screen name="news" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="ranking" />
        <Stack.Screen name="sessions" />
      </Stack>
    </RootGuard>
  );
}
