import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import AdminCreateClassModal from "../../components/Lessons/AdminCreateClassModal";
import AttendanceModal from "../../components/Lessons/AttendanceModal.jsx";
import ClassList from "../../components/Lessons/ClassList";
import Calendar from "../../components/Lessons/WeekCalendar";
import { useEnrollments } from "../../context/EnrollmentsContext";
import { useLessons } from "../../context/LessonsContext";
import { useSchedules } from "../../context/SchedulesContext";
import { useUser } from "../../context/UserContext.jsx";
import styles from "../../Styles/LessonStyles.jsx";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const { lessons } = useLessons();
  const {
    daySchedules,
    fetchSchedulesByDay,
    createScheduleException,
    updateScheduleException,
  } = useSchedules();
  const { enrollUser, fetchClassEnrollmentsByDay } = useEnrollments();

  const lastHomeFocusRef = useRef({ dayKey: null, at: 0 });
  const FOCUS_MIN_INTERVAL_MS = 45_000;
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
  const [attendanceVisible, setAttendanceVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState({});

  const handleTakeAttendance = (cls) => {
    setSelectedClass(cls);
    setAttendanceVisible(true);
  };

  const formatTime = (time) => time.slice(0, 5);
  const toMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

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
    const loadStudents = async () => {
      try {
        const grouped = await fetchClassEnrollmentsByDay(selectedDay);
        const byT = grouped.byTemplateId || {};
        const byE = grouped.byExceptionId || {};
        const result = {};

        for (const cls of daySchedules) {
          const list = cls.date
            ? byE[cls.id] ?? byE[String(cls.id)] ?? []
            : byT[cls.id] ?? byT[String(cls.id)] ?? [];
          result[cls.id] = list.map((s) => ({
            id: s.userId,
            name: s.userName,
            profileImageUrl: s.profileImageUrl || null,
          }));
        }
        setClassStudents(result);
      } catch (err) {
        console.error("Error fetching day class enrollments:", err);
        setClassStudents({});
      }
    };

    if (daySchedules.length > 0) loadStudents();
  }, [daySchedules, selectedDay, fetchClassEnrollmentsByDay]);

  useEffect(() => {
    const mapped = daySchedules
      .map((item) => {
        const start = formatTime(item.startTime);
        const end = formatTime(item.endTime);
        const startMinutes = toMinutes(start);

        const classDateTime = new Date(selectedDay);
        classDateTime.setHours(Math.floor(startMinutes / 60));
        classDateTime.setMinutes(startMinutes % 60);

        const students = (classStudents[item.id] || []).map((s) => ({
          id: s.id,
          name: s.name,
          profileImageUrl: s.profileImageUrl || null, // o ruta de logo por defecto
        }));

        const enrolled = students.some((e) => e.id === user.id);

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
          students,
        };
      })
      .sort((a, b) => a.startMinutes - b.startMinutes);

    setClasses(mapped);
  }, [daySchedules, selectedDay, classStudents, user?.id]);

  useFocusEffect(
    useCallback(() => {
      const dayKey = selectedDay.toISOString().split("T")[0];
      const now = Date.now();
      if (
        lastHomeFocusRef.current.dayKey === dayKey &&
        now - lastHomeFocusRef.current.at < FOCUS_MIN_INTERVAL_MS
      ) {
        return;
      }
      lastHomeFocusRef.current = { dayKey, at: now };
      fetchSchedulesByDay(selectedDay);
    }, [selectedDay, fetchSchedulesByDay]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSchedulesByDay(selectedDay);
    setRefreshing(false);
  };

  const handleEnroll = async (scheduleId, isException = false) => {
    try {
      if (isException) {
        await enrollUser(null, selectedDay, scheduleId);
      } else {
        await enrollUser(scheduleId, selectedDay);
      }

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
          description: cls.isException && !cls.lessonId ? cls.lessonName : null,
          date: selectedDay,
        });
      } else {
        await createScheduleException({
          lessonId: cls.lessonId ?? null,
          startTime: cls.startTime,
          endTime: cls.endTime,
          cancelled: true,
          date: selectedDay,
          description: cls.isException && !cls.lessonId ? cls.lessonName : null,
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
      alert("Please fill in the required fields");
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
        onTakeAttendance={handleTakeAttendance}
      />
      <AttendanceModal
        visible={attendanceVisible}
        onClose={() => setAttendanceVisible(false)}
        classData={selectedClass}
        selectedDay={selectedDay}
        onAttendanceSaved={async () => {
          await fetchSchedulesByDay(selectedDay);
        }}
      />
      <Modal
        isVisible={errorModalVisible}
        onBackdropPress={() => setErrorModalVisible(false)}
      >
        <View style={styles.errorModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.Content}>
              Please pay the current month to access this class.
            </Text>
            <Ionicons
              name="close"
              size={28}
              style={styles.closenonpaidIcon}
              onPress={() => setErrorModalVisible(false)}
            />
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
