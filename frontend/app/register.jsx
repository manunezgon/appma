'use client';

import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUser } from '../context/usercontext';
import { API_BASE_URL } from "./config"

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useUser();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Nombre, email y contraseña son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'No se pudo registrar');
        setLoading(false);
        return;
      }

      const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const tokenData = await loginResponse.json();

      if (!loginResponse.ok) {
        Alert.alert('Registro exitoso, pero no se pudo iniciar sesión automáticamente');
        router.replace('/login');
        setLoading(false);
        return;
      }

      await SecureStore.setItemAsync('userToken', tokenData.token);
      login(tokenData);
      router.replace('/(tabs)');

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#564D58' }}
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
      <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} style={styles.input} />

      <TouchableOpacity onPress={handleRegister} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>REGISTRARSE</Text>
        )}
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 25,
  },
  input: {
    width: "90%", 
    borderWidth: 1,
    borderColor: "#ffffffff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffffff", 
    color: "#000000ff", 
  },
  button: {
    backgroundColor: "#1F0025", 
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffffff",
    fontSize: 16,
  },
});
