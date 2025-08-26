// app/login.jsx
'use client';

import { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from './context/usercontext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email y contraseña son obligatorios');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Credenciales incorrectas');
        return;
      }

      const data = await response.json(); // UserResponseDTO
      login(data); // guarda usuario en Context
      router.replace('/(tabs)'); // redirige a tabs
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  const goToRegister = () => router.push('/register');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Text style={styles.registerText} onPress={goToRegister}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  registerText: { marginTop: 15, color: 'blue', textAlign: 'center' },
});
