import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  RefreshControl,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScheduleWizardModal from "../../components/ScheduleWizard/ScheduleWizardModal.jsx";
import { useEnrollments } from "../../context/EnrollmentsContext";
import { useUser } from "../../context/UserContext";
import styles from "../../Styles/SessionStyle.jsx";
import { colors } from "../../Styles/theme";

export default function Sessions() {
  const { user } = useUser();
  const { enrollments, deleteEnrollment, fetchMyEnrollments } =
    useEnrollments();

  const [refreshing, setRefreshing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const sections = useMemo(() => {
    if (!user || user.role !== "MEMBER") return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = enrollments
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

    return sectionsData;
  }, [user, enrollments]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyEnrollments();
    setRefreshing(false);
  };

  const confirmUnenroll = (enrollmentId) => {
    setSelectedEnrollment(enrollmentId);
    setConfirmVisible(true);
  };

  const handleUnenroll = async () => {
    if (!selectedEnrollment) return;
    try {
      await deleteEnrollment(selectedEnrollment);
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
        <Ionicons name="log-out-outline" size={28} color={colors.danger} />
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
                    <Ionicons name="close" size={28} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleUnenroll}
                    style={styles.modalButton}
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={28}
                      color={colors.danger}
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
