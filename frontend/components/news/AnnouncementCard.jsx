import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../../app/config";
import style from "./Styles";

export default function AnnouncementCard({ announcement, onDeleted }) {
  const { user } = useUser();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE_URL}/announcements/${announcement.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      onDeleted?.();
    } catch (err) {
      console.error("Error deleting announcement:", err);
    } finally {
      setConfirmVisible(false);
    }
  };

  return (
    <View style={style.card}>
      <Text style={style.message}>{announcement.message}</Text>
      <Text style={style.date}>
        {new Date(announcement.createdAt).toLocaleString("es-ES")}
      </Text>

      {user?.role === "ADMIN" && (
        <TouchableOpacity
          onPress={() => setConfirmVisible(true)}
          style={style.deleteButton}
        >
          <Ionicons name="trash-outline" size={25} color="#FF3B30" />
        </TouchableOpacity>
      )}

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={style.modalOverlay}>
          <View style={style.modalContent}>
            <Text style={style.modalText}>¿Eliminar este anuncio?</Text>
            <View style={style.modalButtons}>
              <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                <Ionicons name="close" size={28} color="#69188E" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={28} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}