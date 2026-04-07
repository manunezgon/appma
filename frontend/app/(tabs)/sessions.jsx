import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Modal,
  RefreshControl,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ScheduleWizardModal from "../../components/ScheduleWizard/ScheduleWizardModal.jsx";
import { useUser } from "../../context/UserContext";
import styles from "../../Styles/SessionStyle.jsx";
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
        sectionsData.push({ title: "Today", data: todayClasses });
      if (nextClasses.length)
        sectionsData.push({ title: "Upcoming classes", data: nextClasses });

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

  if (!user) return <Text style={styles.loading}>Loading...</Text>;

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
                No classes today or upcoming.
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
                  Are you sure you want to unenroll from this class?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setConfirmVisible(false);
                      setSelectedEnrollment(null);
                    }}
                    style={styles.modalButton}
                  >
                    <Ionicons name="close" size={28} color="#69188E" />
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
