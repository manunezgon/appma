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
import { API_BASE_URL } from "../config/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, login } = useUser();

  useEffect(() => {
    if (user) router.replace("/(tabs)");
  }, [user, router]);

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!name || !email || !password) {
      Alert.alert("Error", "Name, email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Unable to register");
        setLoading(false);
        return;
      }

      await login({
        token: data.token,
        user: data.user,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => router.push("/login");

  if (user) {
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
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleRegister}
        style={styles.button}
        disabled={loading || !name || !email || !password}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.buttonText}>REGISTER</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.linkText} onPress={goToLogin}>
        Already have an account? Log in
      </Text>
    </KeyboardAwareScrollView>
  );
}
