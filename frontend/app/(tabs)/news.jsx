import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import { useUser } from '../../context/usercontext';
import { API_BASE_URL } from "../config";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Keyboard } from "react-native";
import { Modal } from 'react-native';


export default function News() {
  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);


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
      Keyboard.dismiss();
      fetchAnnouncements();
    } catch (err) {
      console.error("Error creating announcement:", err);
    }
  };

  const confirmDelete = (id) => {
    setSelectedAnnouncement(id);
    setConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedAnnouncement) return;

    try {
      await fetch(`${API_BASE_URL}/announcements/${selectedAnnouncement}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchAnnouncements();
    } catch (err) {
      console.error("Error deleting announcement:", err);
    } finally {
      setConfirmVisible(false);
      setSelectedAnnouncement(null);
    }
  };


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString("es-ES")}</Text>
      {user?.role === "ADMIN" && (
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
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
          <TouchableOpacity onPress={createAnnouncement} disabled={!newMessage.trim()} style={{ opacity: newMessage.trim() ? 1 : 0.4 }}>
            <Ionicons name="megaphone-outline" size={26} color="#7c23b0ff" />
          </TouchableOpacity>

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

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Eliminar este anuncio?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => { setConfirmVisible(false); setSelectedAnnouncement(null); }}
              >
                <Ionicons name="close" size={28} color="#7c23b0ff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete} style={styles.modalButton}>
                <Ionicons name="trash-outline" size={28} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1E1E1E", 
    paddingHorizontal: 20, 
    paddingTop: 50 
  },

  adminBox: { 
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  backgroundColor: "#CCCCCC",
  padding: 10,
  borderRadius: 10,
  gap: 10,
},

  input: { 
  flex: 1,
  backgroundColor: "#ececec",
  padding: 10,
  borderRadius: 10,
},

  card: { 
    backgroundColor: "#ececec", 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 10, 
  },

  message: { 
    fontSize: 14, 
    fontWeight: "600", 
    marginBottom: 6,
    color: "#1E1E1E" 
  },

  date: { 
    fontSize: 12, 
    color: "#555" 
  },

  deleteButton: { 
    padding: 6, 
    alignSelf: "flex-end" 
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#CCCCCC",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },

  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row", 
    justifyContent: "space-between", 
  },

  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  empty: { 
    fontSize: 16, 
    color: "#CCCCCC" 
  },
});
