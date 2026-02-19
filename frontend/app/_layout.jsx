"use client";

import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { UserProvider, useUser } from "../context/usercontext";

function RootGuard({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !user && pathname !== "/login" && pathname !== "/register") {
      router.replace("/login");
    }
  }, [mounted, user, pathname]);

  if (!mounted) return <Text>Cargando...</Text>;

  return user || pathname === "/login" || pathname === "/register"
    ? children
    : null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Heebo-Medium": require("./assets/fonts/Heebo-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: "Heebo-Medium" };

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = { fontFamily: "Heebo-Medium" };

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
