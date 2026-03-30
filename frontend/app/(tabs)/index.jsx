import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import AdminCreateClassModal from "../../components/Lessons/AdminCreateClassModal";
import ClassList from "../../components/Lessons/ClassList";
import styles from "../../components/Lessons/Styles.jsx";
import Calendar from "../../components/Lessons/WeekCalendar";
import { useEnrollments } from "../../context/EnrollmentsContext";
import { useLessons } from "../../context/LessonsContext";
import { useSchedules } from "../../context/SchedulesContext";
import { useUser } from "../../context/UserContext.jsx";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const { lessons, createLesson } = useLessons();
  const {
    daySchedules,
    fetchSchedulesByDay,
    createScheduleException,
    updateScheduleException,
  } = useSchedules();
  const { enrollments, enrollUser, fetchMyEnrollments } = useEnrollments();
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

  // --- Mapeo y actualización de clases ---
  const isSameDay = (dateString, compareDate) => {
    const d1 = new Date(dateString);
    const d2 = new Date(compareDate);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  useEffect(() => {
    const mapped = daySchedules
      .map((item) => {
        const start = formatTime(item.startTime);
        const end = formatTime(item.endTime);
        const startMinutes = toMinutes(start);

        const classDateTime = new Date(selectedDay);
        classDateTime.setHours(Math.floor(startMinutes / 60));
        classDateTime.setMinutes(startMinutes % 60);

        const enrolled = enrollments.some((e) => {
          if (!e) return false;

          if (e.scheduleExceptionId) {
            return (
              e.scheduleExceptionId === item.id &&
              isSameDay(e.date, selectedDay)
            );
          }

          if (e.scheduleTemplateId) {
            return (
              e.scheduleTemplateId === item.id && // 🔹 usar item.id
              isSameDay(e.date, selectedDay)
            );
          }

          return false;
        });

        return {
          id: String(item.id),
          lessonName: item.lessonName ?? item.description ?? "Special Class",
          professorName: item.professorName ?? "",
          time: `${start} - ${end}`,
          startMinutes,
          isEnrolled: enrolled,
          isPast: classDateTime < new Date(),
          lessonId: item.lessonId,
          startTime: start,
          endTime: end,
          isException: item.date !== null,
        };
      })
      .sort((a, b) => a.startMinutes - b.startMinutes);

    setClasses(mapped);
  }, [daySchedules, selectedDay, enrollments]);

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
  const handleEnroll = async (scheduleId, isException = false) => {
    try {
      if (isException) {
        await enrollUser(null, selectedDay, scheduleId);
      } else {
        await enrollUser(scheduleId, selectedDay);
      }

      await fetchMyEnrollments();
      await fetchSchedulesByDay(selectedDay);
    } catch (err) {
      const message = err.message || "Error enrolling";
      if (!message.includes("already enrolled")) {
        setErrorMessage(
          isException ? "Error enrolling in special class" : message,
        );
        setErrorModalVisible(true);
      }
    }
  };

  const onDeleteClass = async (cls) => {
    try {
      const existingException = daySchedules.find(
        (s) =>
          s.date &&
          isSameDay(s.date, selectedDay) &&
          ((s.lessonId && s.lessonId === cls.lessonId) ||
            (s.description && s.description === cls.lessonName)),
      );

      if (existingException) {
        await updateScheduleException(existingException.id, {
          cancelled: true,
          startTime: cls.startTime,
          endTime: cls.endTime,
          lessonId: cls.lessonId ?? null,
          description: cls.isException && !cls.lessonId ? cls.lessonName : null, // 👈 agregar descripción si no hay lesson
          date: selectedDay,
        });
      } else {
        await createScheduleException({
          lessonId: cls.lessonId ?? null,
          startTime: cls.startTime,
          endTime: cls.endTime,
          cancelled: true,
          date: selectedDay,
          description: cls.isException && !cls.lessonId ? cls.lessonName : null, // 👈 mismo
        });
      }

      await fetchSchedulesByDay(selectedDay);
    } catch (err) {
      console.error("Error updating schedule exception:", err);
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

    setSelectedLessonId(null);
    setNewStartTime("");
    setNewEndTime("");
    setNewDescription("");
    setCreateMode(null);

    setAdminModalVisible(false);
  };

  const handleCreateNewException = async () => {
    if (!newStartTime || !newEndTime || !newDescription) {
      alert("Completa los campos obligatorios");
      return;
    }

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
    setSelectedLessonId(null);
    setCreateMode(null);

    setAdminModalVisible(false);
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
