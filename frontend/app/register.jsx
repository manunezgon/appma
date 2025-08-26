'use client';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>REGISTRARSE</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});
