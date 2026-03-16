import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import AdminCreateClassModal from "../../components/Lessons/AdminCreateClassModal";
import ClassList from "../../components/Lessons/ClassList";
import ClassModal from "../../components/Lessons/ClassModal";
import Calendar from "../../components/Lessons/WeekCalendar";
import { useLessons } from "../../context/LessonsContext";
import { useSchedules } from "../../context/SchedulesContext";
import { useEnrollments } from "../../context/EnrollmentsContext"; 
import { useUser } from "../../context/UserContext";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const { lessons, createLesson } = useLessons();
  const { daySchedules, fetchSchedulesByDay, createSchedule, updateSchedule, createScheduleException } = useSchedules();
  const { enrollUser } = useEnrollments(); 
  const { user } = useUser();

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [createMode, setCreateMode] = useState(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [newLessonName, setNewLessonName] = useState("");
  const [newProfessorName, setNewProfessorName] = useState("");

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
      id: String(item.id ?? ""),
      lessonName: item.lessonName,
      professorName: item.professorName,
      time: `${start} - ${end}`,
      startMinutes,
      isEnrolled: item.isEnrolled,
      isPast,
      dayOfWeek: item.dayOfWeek,
      lessonId: item.lessonId,
      startTime: start,
      endTime: end,
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
    }, [selectedDay])
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
      setClasses(prev =>
        prev.map(cls =>
          cls.id === scheduleTemplateId ? { ...cls, isEnrolled: true } : cls
        )
      );
    } catch (err) {
      setErrorMessage("Mes en curso no pagado");
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

  const handleModalSubmit = async ({ dayOfWeek, startTime, endTime, lessonId }) => {
    try {
      if (modalData.id) {
        await updateSchedule(modalData.id, { dayOfWeek, startTime, endTime, lessonId });
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
    setAdminModalVisible(false);
  };

  const handleCreateNewLessonAndException = async () => {
    try {
      const savedLesson = await createLesson({
        lessonName: newLessonName,
        professorName: newProfessorName,
      });
      await createScheduleException({
        lessonId: savedLesson.id,
        startTime: newStartTime,
        endTime: newEndTime,
        cancelled: false,
        date: selectedDay,
      });
      setAdminModalVisible(false);
    } catch (error) {
      console.error(error);
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
          <Text style={styles.addButtonText}>+ Crear Clase</Text>
        </TouchableOpacity>
      )}
      <ClassList
        classes={classes}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEnroll={handleEnroll}
        userRole={user?.role}
        onDeleteClass={onDeleteClass}
      />
      <ClassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        initialData={modalData}
        lessons={lessons}
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
        newLessonName={newLessonName}
        setNewLessonName={setNewLessonName}
        newProfessorName={newProfessorName}
        setNewProfessorName={setNewProfessorName}
        onCreateExisting={handleCreateException}
        onCreateNew={handleCreateNewLessonAndException}
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
  closenonpaidIcon: { color: "purple" },
  addButtonText: { color: "white", fontSize: 16, textAlign: "center" },
  addButton: {
    backgroundColor: "purple",
    padding: 12,
    borderRadius: 8,
    alignSelf: "center",
    width: "90%",
    marginVertical: 12,
  },
});