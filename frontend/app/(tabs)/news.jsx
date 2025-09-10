import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useUser } from '../../context/usercontext';
import { API_BASE_URL } from "../config"

export default function News() {
  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        setAnnouncements([]);
        return;
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse JSON:", text);
        setAnnouncements([]);
        return;
      }

      setAnnouncements(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);

    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [user])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnouncements();
    setRefreshing(false);
  };

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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
