"use client";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUser } from "../context/UserContext";
import styles from "../Styles/GlobalStyles";
import { colors } from "../Styles/theme";
import { loginRequest } from "../services/usersApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();
  const { user, login, loading } = useUser();

  useEffect(() => {
    if (user) router.replace("/(tabs)/news");
  }, [user, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    Keyboard.dismiss();
    setLoggingIn(true);

    try {
      const data = await loginRequest({ email, password });

      await login({
        user: data.user,
        token: data.token,
      });

      router.replace("/(tabs)/news");
    } catch (error) {
      console.error(error);
      setPassword("");
      Alert.alert("Error", error?.message || "Unable to connect to the server");
    } finally {
      setLoggingIn(false);
    }
  };

  const goToRegister = () => router.push("/register");

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraHeight={Platform.OS === "android" ? 80 : 0}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("./assets/images/white_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.textSubtle}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.textSubtle}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoComplete="password"
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}
        disabled={loggingIn || !email || !password}
      >
        {loggingIn ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.buttonText}>LOG IN</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.linkText} onPress={goToRegister}>
        Don&apos;t have an account? Sign up
      </Text>
    </KeyboardAwareScrollView>
  );
}
