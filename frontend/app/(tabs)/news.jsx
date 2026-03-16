import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../config";

export default function News() {
  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const pagerRef = useRef(null);
  const [page, setPage] = useState(0);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!response.ok) return setAnnouncements([]);
      const data = await response.json();
      setAnnouncements(
        Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [],
      );
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [user]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnouncements();
    setRefreshing(false);
  };

  const createAnnouncement = async () => {
    if (!newMessage.trim()) return;
    try {
      await fetch(
        `${API_BASE_URL}/announcements?message=${encodeURIComponent(newMessage)}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      );
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
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString("es-ES")}
      </Text>
      {user?.role === "ADMIN" && (
        <TouchableOpacity
          onPress={() => confirmDelete(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={28} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
  );

  const width = Dimensions.get("window").width;

  const images = [
    require("../assets/carrousel/img1.jpg"),
    require("../assets/carrousel/img2.jpg"),
    require("../assets/carrousel/img3.jpg"),
    require("../assets/carrousel/img4.jpg"),
  ];

  const pageRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage =
        pageRef.current + 1 >= images.length ? 0 : pageRef.current + 1;
      pagerRef.current?.setPage(nextPage);
      pageRef.current = nextPage;
      setPage(nextPage); // solo para actualizar indicador
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/white_logo.png")}
          style={styles.logo}
        />
        <Text style={styles.gymName}>La Forja</Text>
      </View>

      <View style={styles.carouselContainer}>
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={(e) => {
            pageRef.current = e.nativeEvent.position; // mantener ref sincronizada
            setPage(e.nativeEvent.position);
          }}
        >
          {images.map((img, index) => (
            <View key={index} style={styles.page}>
              <Image source={img} style={styles.image} />
            </View>
          ))}
        </PagerView>
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, { opacity: page === index ? 1 : 0.3 }]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.title}>Noticias</Text>
      {user?.role === "ADMIN" && (
        <View style={styles.adminBox}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un anuncio..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            onPress={createAnnouncement}
            disabled={!newMessage.trim()}
            style={{ opacity: newMessage.trim() ? 1 : 0.4 }}
          >
            <Ionicons name="megaphone-outline" size={28} color="#7c23b0ff" />
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Eliminar este anuncio?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setConfirmVisible(false);
                  setSelectedAnnouncement(null);
                }}
              >
                <Ionicons name="close" size={28} color="#7c23b0ff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={styles.modalButton}
              >
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
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 6, // separación entre los puntos
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7c23b0", // color principal de la app
    marginBottom: 10,
  },
  carouselContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111",
    elevation: 5,
  },

  pager: {
    flex: 1,
  },

  page: {
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 15,
  },

  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  gymName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7c23b0",
    letterSpacing: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  adminBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#2A2A2A",
    padding: 10,
    borderRadius: 12,
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
  },

  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#7c23b0",
  },

  message: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: "#FFFFFF",
  },

  date: {
    fontSize: 12,
    color: "#555",
  },

  deleteButton: {
    padding: 6,
    alignSelf: "flex-end",
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
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    fontSize: 16,
    color: "#CCCCCC",
  },
});
