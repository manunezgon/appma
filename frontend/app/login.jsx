// app/login.jsx
'use client';

import { useState } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, Alert } from 'react-native';
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
      const response = await fetch('http://192.168.1.8:8080/users/login', {
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
      <Image 
        source={require("./assets/images/la_forja_logo.png")} 
        style={styles.logo} 
        resizeMode="contain"
      />
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
  container: {
    flex: 1,
    backgroundColor: "#cac5c5ff", // gris oscuro de fondo
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000ff", // blanco sobre fondo oscuro
    marginBottom: 20,
  },
  input: {
    width: "80%", // más pequeño, centrado
    borderWidth: 1,
    borderColor: "#888", // gris medio
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#bdb7b7ff", // gris un poco más claro que el fondo
    color: "#fff", // texto blanco
  },
  button: {
    backgroundColor: "#4B0082", // violeta
    padding: 12,
    borderRadius: 8,
    width: "80%", // más estrecho
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkText: {
    color: "#000000ff", // gris claro
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
