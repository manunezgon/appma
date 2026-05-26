import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../../context/UserContext";
import style from "../../Styles/NewsStyles";

export default function AnnouncementCard({
  announcement,
  onDeleted,
  onDelete,
}) {
  const { user } = useUser();
  const [confirmVisible, setConfirmVisible] = useState(false);

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
              <TouchableOpacity onPress={onDelete}>
                <Ionicons name="trash-outline" size={28} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
