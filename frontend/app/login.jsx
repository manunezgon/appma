'use client';

import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from "./config";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();
  const { user, login, loading } = useUser();

  useEffect(() => {
    if (user) router.replace('/(tabs)');
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email y contraseña son obligatorios');
      return;
    }

    setLoggingIn(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Credenciales incorrectas');
        setPassword(''); 
        setLoggingIn(false);
        return;
      }

      await SecureStore.setItemAsync('userToken', data.token);
      const meResponse = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const fullUser = await meResponse.json();
      login({
        token: data.token, ...fullUser,
      });
      
      router.replace('/(tabs)');

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoggingIn(false);
    }
  };

  const goToRegister = () => router.push('/register');

  if (loading || user) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#1E1E1E' }}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraHeight={Platform.OS === 'android' ? 80 : 0}
      keyboardShouldPersistTaps="handled"
    >
      <Image 
        source={require("./assets/images/white_logo.png")} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Contraseña" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loggingIn}>
        {loggingIn ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.linkText} onPress={goToRegister}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 25,
  },
  input: {
    width: "90%", 
    borderWidth: 1,
    borderColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F5F5F5", 
    color: "#000000ff", 
  },
  button: {
    backgroundColor: "#7c23b0ff", 
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#F5F5F5",
    fontSize: 16,
  },
  linkText: {
    color: "#F5F5F5", 
    marginTop: 30,
  },
});
