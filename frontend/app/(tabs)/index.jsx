import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import AdminCreateClassModal from "../../components/Lessons/AdminCreateClassModal";
import ClassList from "../../components/Lessons/ClassList";
import Calendar from "../../components/Lessons/WeekCalendar";
import { useEnrollments } from "../../context/EnrollmentsContext";
import { useLessons } from "../../context/LessonsContext";
import { useSchedules } from "../../context/SchedulesContext";
import { useUser } from "../../context/UserContext";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const { lessons, createLesson } = useLessons();
  const {
    daySchedules,
    fetchSchedulesByDay,
    createSchedule,
    updateSchedule,
    createScheduleException,
  } = useSchedules();
  const { enrollUser } = useEnrollments();
  const { user } = useUser();

  const [refreshing, setRefreshing] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [createMode, setCreateMode] = useState(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  // --- Helpers ---
  const formatTime = (time) => time.slice(0, 5);
  const toMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const mapClassData = (item) => {
    const start = formatTime(item.startTime);
    const end = formatTime(item.endTime);

    const startMinutes = toMinutes(start);

    const classDateTime = new Date(selectedDay);
    classDateTime.setHours(Math.floor(startMinutes / 60));
    classDateTime.setMinutes(startMinutes % 60);

    const isPast = classDateTime < new Date();

    return {
      id: String(item.id),
      lessonName: item.lessonName ?? item.description ?? "Special Class",
      professorName: item.professorName ?? "",
      time: `${start} - ${end}`,
      startMinutes,
      isEnrolled: false, // backend aún no lo envía
      isPast,
      lessonId: item.lessonId,
      startTime: start,
      endTime: end,
      isException: item.date !== null, // 👈 clave
    };
  };

  // --- Mapeo y actualización de clases ---
  useEffect(() => {
    const mapped = daySchedules
      .map(mapClassData)
      .sort((a, b) => a.startMinutes - b.startMinutes);
    setClasses(mapped);
  }, [daySchedules, selectedDay]);

  useFocusEffect(
    useCallback(() => {
      fetchSchedulesByDay(selectedDay);
    }, [selectedDay]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSchedulesByDay(selectedDay);
    setRefreshing(false);
  };

  // --- Enroll ---
  const handleEnroll = async (scheduleTemplateId) => {
    try {
      await enrollUser(scheduleTemplateId, selectedDay);
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === scheduleTemplateId ? { ...cls, isEnrolled: true } : cls,
        ),
      );
    } catch (err) {
      setErrorMessage("Mes en curso no pagado");
      setErrorModalVisible(true);
    }
  };

  // --- Enroll para exceptions ---
  const handleEnrollException = async (exceptionId) => {
    try {
      await enrollUser(null, selectedDay, exceptionId); // pasamos null para templateId y exceptionId
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === exceptionId ? { ...cls, isEnrolled: true } : cls,
        ),
      );
    } catch (err) {
      setErrorMessage("Error al inscribirse en la clase especial");
      setErrorModalVisible(true);
    }
  };

  const onDeleteClass = async (cls) => {
    try {
      await createScheduleException({
        lessonId: cls.lessonId,
        startTime: cls.startTime,
        endTime: cls.endTime,
        cancelled: true,
        date: selectedDay,
      });
      await fetchSchedulesByDay(selectedDay);
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalSubmit = async ({
    dayOfWeek,
    startTime,
    endTime,
    lessonId,
  }) => {
    try {
      if (modalData.id) {
        await updateSchedule(modalData.id, {
          dayOfWeek,
          startTime,
          endTime,
          lessonId,
        });
      } else {
        await createSchedule({ dayOfWeek, startTime, endTime, lessonId });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateException = async () => {
    if (!selectedLessonId || !newStartTime || !newEndTime) return;
    await createScheduleException({
      lessonId: selectedLessonId,
      startTime: newStartTime,
      endTime: newEndTime,
      cancelled: false,
      date: selectedDay,
    });
    await fetchSchedulesByDay(selectedDay);
    setAdminModalVisible(false);
  };

  const handleCreateNewException = async () => {
    if (!newStartTime || !newEndTime || !newDescription) {
      alert("Completa los campos obligatorios");
      return;
    }

    try {
      await createScheduleException({
        lessonId: null,
        description: newDescription,
        startTime: newStartTime,
        endTime: newEndTime,
        cancelled: false,
        date: selectedDay,
      });

      await fetchSchedulesByDay(selectedDay);

      setNewDescription("");
      setNewStartTime("");
      setNewEndTime("");
      setCreateMode(null);
      setAdminModalVisible(false);
    } catch (err) {
      console.error("Error creating exception:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      {user?.role === "ADMIN" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAdminModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      <ClassList
        classes={classes}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEnroll={handleEnroll}
        onEnrollException={handleEnrollException}
        userRole={user?.role}
        onDeleteClass={onDeleteClass}
      />
      <Modal
        isVisible={errorModalVisible}
        onBackdropPress={() => setErrorModalVisible(false)}
      >
        <View style={styles.errorModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.Title}>{errorMessage}</Text>
            <Ionicons
              name="close"
              size={28}
              style={styles.closenonpaidIcon}
              onPress={() => setErrorModalVisible(false)}
            />
          </View>
          <View>
            <Text style={styles.Content}>
              Por favor, paga el mes correspondiente para acceder a esta clase.
            </Text>
          </View>
        </View>
      </Modal>
      <AdminCreateClassModal
        visible={adminModalVisible}
        onClose={() => {
          setAdminModalVisible(false);
          setCreateMode(null);
          setSelectedLessonId(null);
          setNewStartTime("");
          setNewEndTime("");
          setNewDescription("");
        }}
        createMode={createMode}
        setCreateMode={setCreateMode}
        lessonsList={lessons}
        selectedLessonId={selectedLessonId}
        setSelectedLessonId={setSelectedLessonId}
        newStartTime={newStartTime}
        setNewStartTime={setNewStartTime}
        newEndTime={newEndTime}
        setNewEndTime={setNewEndTime}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        onCreateExisting={handleCreateException}
        onCreateNew={handleCreateNewException}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", paddingTop: 50 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  errorModal: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
  },
  Title: { color: "#fff", fontWeight: "bold", fontSize: 22 },
  Content: { color: "#ccc", fontWeight: "bold", textAlign: "center" },
  closenonpaidIcon: { color: "#69188E" },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#69188E",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
});
