import { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";

export default function News() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://192.168.1.86:8080/announcements"); // 👈 tu endpoint
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString("es-ES")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {announcements.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.empty}>No hay noticias por ahora</Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 70,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  empty: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
