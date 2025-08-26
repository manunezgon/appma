'use client';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUser } from '../context/usercontext';

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
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#EAE4ED' }}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraHeight={Platform.OS === 'android' ? 80 : 0}
      keyboardShouldPersistTaps="handled"
    >
      <Image 
        source={require("./assets/images/la_forja_logo.png")} 
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
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
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
    backgroundColor: "#69188E", 
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffffff",
  },
  linkText: {
    color: "#1F0025", 
    marginTop: 30,
  },
});
