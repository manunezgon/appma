'use client';

import { useEffect, useState } from 'react';
import { useRouter, Slot } from 'expo-router';
import { useUser } from './context/usercontext';

export default function RootGuard() {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.replace('/login');
    }
  }, [mounted, user]);

  if (!mounted) {
    return null; // mientras se monta
  }

  return user ? <Slot /> : null; // renderiza Slot si hay usuario
}
