import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import ClassList from "../../components/ClassList";
import Calendar from "../../components/WeekCalendar";
import { useUser } from "../../context/usercontext";
import { API_BASE_URL } from "../config";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [lessonsList, setLessonsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 NUEVOS ESTADOS ADMIN
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const [createMode, setCreateMode] = useState(null);
  // "new" | "existing"

  const [newLessonName, setNewLessonName] = useState("");
  const [newProfessorName, setNewProfessorName] = useState("");

  const { user } = useUser();

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

  // --- Fetch clases ---
  const fetchClasses = async () => {
    try {
      const dateStr = selectedDay.toISOString().split("T")[0];
      const res = await fetch(
        `${API_BASE_URL}/scheduleTemplates/day?date=${dateStr}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      );

      const data = await res.json();
      const mapped = data
        .map(mapClassData)
        .sort((a, b) => a.startMinutes - b.startMinutes);
      setClasses(mapped);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    }
  };

  const fetchLessons = async () => {
    if (user?.role !== "ADMIN") return;
    try {
      const res = await fetch(`${API_BASE_URL}/lessons`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setLessonsList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchClasses();
      fetchLessons();
    }, [selectedDay, user]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
  };

  // --- CREAR EXCEPCIÓN (ADMIN) ---
  const handleCreateException = async () => {
    try {
      if (!selectedLessonId || !newStartTime || !newEndTime) return;

      const dateStr = selectedDay.toISOString().split("T")[0];

      const response = await fetch(`${API_BASE_URL}/scheduleExceptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          date: dateStr,
          startTime: newStartTime,
          endTime: newEndTime,
          lessonId: selectedLessonId,
          cancelled: false,
        }),
      });

      if (!response.ok) throw new Error("Error creating class");

      setAdminModalVisible(false);
      setNewStartTime("");
      setNewEndTime("");
      setSelectedLessonId(null);

      fetchClasses();
    } catch (error) {
      console.error(error);
    }
  };

  // --- Enroll ---
  const handleEnroll = async (scheduleTemplateId) => {
    try {
      const dateStr = selectedDay.toISOString().split("T")[0];
      const response = await fetch(`${API_BASE_URL}/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ scheduleTemplateId, date: dateStr }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrorMessage("Mes en curso no pagado");
        setErrorModalVisible(true);
        return;
      }
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === scheduleTemplateId ? { ...cls, isEnrolled: true } : cls,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteClass = async (cls) => {
    try {
      const dateStr = selectedDay.toISOString().split("T")[0];
      await fetch(`${API_BASE_URL}/scheduleExceptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          date: dateStr,
          startTime: cls.startTime,
          endTime: cls.endTime,
          lessonId: cls.lessonId,
          cancelled: true,
        }),
      });

      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNewLessonAndException = async () => {
    try {
      if (!newLessonName || !newProfessorName || !newStartTime || !newEndTime)
        return;

      // 1️⃣ Crear lesson
      const lessonResponse = await fetch(`${API_BASE_URL}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          lessonName: newLessonName,
          professorName: newProfessorName,
        }),
      });

      if (!lessonResponse.ok) throw new Error("Error creating lesson");

      const savedLesson = await lessonResponse.json();

      // 2️⃣ Crear excepción con la nueva lesson
      const dateStr = selectedDay.toISOString().split("T")[0];

      await fetch(`${API_BASE_URL}/scheduleExceptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          date: dateStr,
          startTime: newStartTime,
          endTime: newEndTime,
          lessonId: savedLesson.id,
          cancelled: false,
        }),
      });

      // Reset
      setAdminModalVisible(false);
      setCreateMode(null);
      setNewLessonName("");
      setNewProfessorName("");
      setNewStartTime("");
      setNewEndTime("");

      fetchLessons();
      fetchClasses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      {/* 🔥 BOTÓN SOLO ADMIN */}
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
        userRole={user?.role}
        onEnroll={handleEnroll}
        onDeleteClass={onDeleteClass}
      />

      {/* 🔥 MODAL CREAR CLASE ADMIN */}
      <Modal
        isVisible={adminModalVisible}
        onBackdropPress={() => {
          setAdminModalVisible(false);
          setCreateMode(null);
        }}
      >
        <View style={styles.adminModal}>
          <Text style={styles.Title}>Crear Clase</Text>

          {/* 🔹 Selección de modo */}
          {!createMode && (
            <>
              <TouchableOpacity
                style={styles.modeButton}
                onPress={() => setCreateMode("new")}
              >
                <Text style={styles.modeButtonText}>Crear nueva clase</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modeButton}
                onPress={() => setCreateMode("existing")}
              >
                <Text style={styles.modeButtonText}>Usar clase existente</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 🔹 CREAR NUEVA LESSON */}
          {createMode === "new" && (
            <>
              <TextInput
                placeholder="Nombre de la clase"
                placeholderTextColor="#888"
                value={newLessonName}
                onChangeText={setNewLessonName}
                style={styles.input}
              />

              <TextInput
                placeholder="Profesor"
                placeholderTextColor="#888"
                value={newProfessorName}
                onChangeText={setNewProfessorName}
                style={styles.input}
              />

              <TextInput
                placeholder="Hora inicio (HH:MM)"
                placeholderTextColor="#888"
                value={newStartTime}
                onChangeText={setNewStartTime}
                style={styles.input}
              />

              <TextInput
                placeholder="Hora fin (HH:MM)"
                placeholderTextColor="#888"
                value={newEndTime}
                onChangeText={setNewEndTime}
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCreateNewLessonAndException}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* 🔹 USAR LESSON EXISTENTE */}
          {createMode === "existing" && (
            <>
              <Picker
                selectedValue={selectedLessonId}
                onValueChange={(value) => setSelectedLessonId(value)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona una clase" value={null} />
                {lessonsList.map((lesson) => (
                  <Picker.Item
                    key={lesson.id}
                    label={`${lesson.lessonName} - ${lesson.professorName}`}
                    value={lesson.id}
                  />
                ))}
              </Picker>

              <TextInput
                placeholder="Hora inicio (HH:MM)"
                placeholderTextColor="#888"
                value={newStartTime}
                onChangeText={setNewStartTime}
                style={styles.input}
              />

              <TextInput
                placeholder="Hora fin (HH:MM)"
                placeholderTextColor="#888"
                value={newEndTime}
                onChangeText={setNewEndTime}
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCreateException}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* MODAL ERROR */}
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
          <View style={styles.modalContent}>
            <Text style={styles.Content}>
              Por favor, paga el mes correspondiente para acceder a esta clase.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", paddingTop: 50 },

  addButton: {
    backgroundColor: "#7c23b0ff",
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  adminModal: {
    backgroundColor: "#2a2a2a",
    padding: 20,
    borderRadius: 12,
  },

  picker: {
    color: "white",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#3a3a3a",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: "#7c23b0ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

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

  Title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },

  Content: {
    color: "#ccc",
    fontWeight: "bold",
    textAlign: "center",
  },

  closenonpaidIcon: {
    color: "purple",
  },

  modalContent: {
    padding: 16,
  },

  modeButton: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },

  modeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
