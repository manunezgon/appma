import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import { useUser } from '../../context/usercontext';
import { API_BASE_URL } from "../config";

export default function News() {
  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!response.ok) return setAnnouncements([]);
      const data = await response.json();
      setAnnouncements(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
    }
  };

  useFocusEffect(
    useCallback(() => { fetchAnnouncements(); }, [user])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnouncements();
    setRefreshing(false);
  };

  const createAnnouncement = async () => {
    if (!newMessage.trim()) return;
    try {
      await fetch(`${API_BASE_URL}/announcements?message=${encodeURIComponent(newMessage)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setNewMessage("");
      fetchAnnouncements();
    } catch (err) {
      console.error("Error creating announcement:", err);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchAnnouncements();
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString("es-ES")}</Text>
      {user?.role === "ADMIN" && (
        <TouchableOpacity onPress={() => deleteAnnouncement(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {user?.role === "ADMIN" && (
        <View style={styles.adminBox}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un anuncio..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <Button title="Publicar" onPress={createAnnouncement} />
        </View>
      )}

      {announcements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No hay noticias por ahora</Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 70 },
  adminBox: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 8, marginBottom: 10 },
  card: { backgroundColor: "#f5f5f5", borderRadius: 12, padding: 12, marginBottom: 10, elevation: 2 },
  message: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  date: { fontSize: 12, color: "#666" },
  deleteButton: { marginTop: 8, padding: 6, backgroundColor: "#ff4444", borderRadius: 8, alignSelf: "flex-start" },
  deleteText: { color: "#fff", fontSize: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { fontSize: 16, color: "#888" },
});
