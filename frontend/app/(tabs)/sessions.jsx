import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Modal,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ScheduleWizardModal from "../../components/ScheduleWizard/ScheduleWizardModal.jsx";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../config";

export default function Sessions() {
  const { user } = useUser();
  const [sections, setSections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const fetchEnrollments = async () => {
    if (!user || user.role !== "MEMBER") return; 
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments/me`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!response.ok) throw new Error(response.status);
      const data = await response.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = data
        .map((e) => {
          const startHour = e.time.split(" - ")[0];
          const classDateTime = new Date(`${e.date}T${startHour}`);
          return { ...e, classDateTime };
        })
        .filter((e) => e.classDateTime >= today);

      const todayClasses = upcoming
        .filter((e) => {
          const d = e.classDateTime;
          return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          );
        })
        .sort((a, b) => a.classDateTime - b.classDateTime);

      const nextClasses = upcoming
        .filter(
          (e) => !todayClasses.some((tc) => tc.enrollmentId === e.enrollmentId),
        )
        .sort((a, b) => a.classDateTime - b.classDateTime);

      const sectionsData = [];
      if (todayClasses.length)
        sectionsData.push({ title: "Hoy", data: todayClasses });
      if (nextClasses.length)
        sectionsData.push({ title: "Próximas clases", data: nextClasses });

      setSections(sectionsData);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setSections([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEnrollments();
    }, [user]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEnrollments();
    setRefreshing(false);
  };

  const confirmUnenroll = (enrollmentId) => {
    setSelectedEnrollment(enrollmentId);
    setConfirmVisible(true);
  };

  const handleUnenroll = async () => {
    if (!selectedEnrollment) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/enrollments/${selectedEnrollment}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      );
      if (response.ok) {
        setSections((prev) =>
          prev
            .map((section) => ({
              ...section,
              data: section.data.filter(
                (e) => e.enrollmentId !== selectedEnrollment,
              ),
            }))
            .filter((section) => section.data.length),
        );
      } else console.error("Error unenrolling:", response.status);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmVisible(false);
      setSelectedEnrollment(null);
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
      <TouchableOpacity onPress={() => confirmUnenroll(item.enrollmentId)}>
        <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeader}>{section.title}</Text>
    </View>
  );

  if (!user)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>Cargando...</Text>
    );

  return (
    <View style={styles.container}>
      {user.role === "MEMBER" ? (
        <>
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.enrollmentId.toString()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={
              <Text style={styles.noClasses}>
                No tienes clases hoy ni próximamente.
              </Text>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />

          <Modal visible={confirmVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  ¿Seguro que quieres desapuntarte de esta clase?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setConfirmVisible(false);
                      setSelectedEnrollment(null);
                    }}
                    style={styles.modalButton}
                  >
                    <Ionicons name="close" size={28} color="#7c23b0ff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleUnenroll}
                    style={styles.modalButton}
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={28}
                      color="#FF3B30"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <ScheduleWizardModal visible={true} onClose={() => {}} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  sectionHeaderContainer: { paddingTop: 20, paddingBottom: 10 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    justifyContent: "center",
    textAlign: "center",
  },
  classCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#CCCCCC",
  },
  className: { fontSize: 16, fontWeight: "600" },
  professorName: { fontSize: 14, color: "#555" },
  date: { fontSize: 14, color: "#555" },
  time: { fontSize: 14, color: "#555" },
  noClasses: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
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
  modalText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: { padding: 5 },
});
