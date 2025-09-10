import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { RefreshControl, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useUser } from "../../context/usercontext";
import { API_BASE_URL } from "../config"

export default function Sessions() {
  const { user } = useUser();
  const [sections, setSections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments/me`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!response.ok) throw new Error(response.status);
      const data = await response.json();

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const upcoming = data.filter(e => e.date >= todayStr);

      const todayClasses = upcoming.filter(e => e.date === todayStr)
        .sort((a, b) => a.time.localeCompare(b.time));
      const nextClasses = upcoming.filter(e => e.date > todayStr)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

      const sectionsData = [];
      if (todayClasses.length) sectionsData.push({ title: "Hoy", data: todayClasses });
      if (nextClasses.length) sectionsData.push({ title: "Próximas clases", data: nextClasses });

      setSections(sectionsData);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setSections([]);
    }
  };

  useFocusEffect(useCallback(() => { fetchEnrollments(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEnrollments();
    setRefreshing(false);
  };

  const handleUnenroll = async (enrollmentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments/${enrollmentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) setSections(prev =>
        prev.map(section => ({
          ...section,
          data: section.data.filter(e => e.enrollmentId !== enrollmentId)
        })).filter(section => section.data.length)
      );
      else console.error("Error unenrolling:", response.status);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.classCard}>
      <View>
        <Text style={styles.className}>{item.lessonName}</Text>
        <Text style={styles.professorName}>{item.professorName}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <TouchableOpacity style={styles.unenrollButton} onPress={() => handleUnenroll(item.enrollmentId)}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.enrollmentId.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={<Text style={styles.noClasses}>No tienes clases hoy ni próximamente.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 20 },
  sectionHeader: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  classCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, marginBottom: 10, borderRadius: 10, backgroundColor: "#f8f8f8" },
  className: { fontSize: 16, fontWeight: "600" },
  professorName: { fontSize: 14, color: "#555" },
  date: { fontSize: 14, color: "#555" },
  time: { fontSize: 14, color: "#555" },
  unenrollButton: { padding: 5 },
  noClasses: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#999" },
});
