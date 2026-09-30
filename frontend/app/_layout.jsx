"use client";

import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { LessonsProvider } from "../context/LessonsContext";
import { PaymentsProvider } from "../context/PaymentsContext";
import { SchedulesProvider } from "../context/SchedulesContext";
import { UserProvider, useUser } from "../context/UserContext";
import { EnrollmentsProvider } from "../context/EnrollmentsContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import * as NavigationBar from "expo-navigation-bar";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: "Heebo-Medium" };

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = { fontFamily: "Heebo-Medium" };

function RootGuard({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname !== "/login" && pathname !== "/register") {
      router.replace("/login");
    }
  }, [user, pathname, router]);

  return user || pathname === "/login" || pathname === "/register"
    ? children
    : null;
}

function NavigationBarController() {
  const { theme } = useTheme();

  useEffect(() => {
    NavigationBar.setStyle(theme === "dark" ? "light" : "dark");
  }, [theme]);

  return null;
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

  return (
    <LanguageProvider>
      <ThemeProvider>
        <NavigationBarController />
        <UserProvider>
          <EnrollmentsProvider>
            <PaymentsProvider>
              <LessonsProvider>
                <SchedulesProvider>
                  <RootGuard>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="login"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="register"
                        options={{ headerShown: false }}
                      />
                    </Stack>
                  </RootGuard>
                </SchedulesProvider>
              </LessonsProvider>
            </PaymentsProvider>
          </EnrollmentsProvider>
        </UserProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
