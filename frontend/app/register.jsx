// app/register.jsx
'use client';

import { useState } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Nombre, email y contraseña son obligatorios');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.8:8080/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'No se pudo registrar');
        return;
      }

      Alert.alert('Éxito', 'Usuario registrado correctamente');
      router.replace('/login'); // Redirige al login
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require("./assets/images/la_forja_logo.png")} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={styles.title}>Registrarse</Text>
      <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} style={styles.input} />
      <Button title="Registrarse" onPress={handleRegister} />
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

