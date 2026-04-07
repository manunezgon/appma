import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { API_BASE_URL } from "../../app/config";
import { useUser } from "../../context/UserContext";
import styles from "../../Styles/LessonStyles.jsx";

export default function AttendanceModal({
  visible,
  onClose,
  classData,
  selectedDay,
  onAttendanceSaved,
}) {
  const { user } = useUser();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && classData) {
      fetchStudents();
    }
  }, [visible, classData]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDay.toISOString().split("T")[0];

      let url = `${API_BASE_URL}/enrollments/class?date=${dateStr}`;

      if (classData.isException) {
        url += `&scheduleExceptionId=${classData.id}`;
      } else {
        url += `&scheduleTemplateId=${classData.id}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = await res.json();
      console.log("ATTENDANCE RESPONSE:", data);
      console.log("ATTENDANCE URL:", url);

      if (!res.ok) {
        console.error("Backend error:", data);
        setStudents([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.warn("Unexpected response format:", data);
        setStudents([]);
        return;
      }

      const formatted = data.map((s) => ({
        id: s.userId,
        name: s.userName,
        attended: s.attended,
      }));

      setStudents(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attended: !s.attended } : s)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dateStr = selectedDay.toISOString().split("T")[0];

      const presentUserIds = students
        .filter((s) => s.attended)
        .map((s) => s.id);

      const body = {
        date: dateStr,
        presentUserIds,
        scheduleTemplateId: classData.isException ? null : Number(classData.id),
        scheduleExceptionId: classData.isException
          ? Number(classData.id)
          : null,
      };

      console.log("Saving attendance with body:", body);

      const res = await fetch(`${API_BASE_URL}/enrollments/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error saving attendance:", errorData);
        return;
      }

      // 🔹 Aquí actualizamos los enrollments del contexto
      if (typeof onAttendanceSaved === "function") {
        await onAttendanceSaved(); // esto puede llamar fetchSchedulesByDay
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        {/* HEADER */}
        <View style={styles.modalHeader}>
          <Text style={styles.title}>{classData?.lessonName}</Text>
          <Ionicons name="close" size={26} color="#fff" onPress={onClose} />
        </View>

        {/* CONTENT */}
        {loading ? (
          <ActivityIndicator size="large" color="purple" />
        ) : (
          <ScrollView style={styles.list}>
            {students.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={styles.row}
                onPress={() => toggleAttendance(student.id)}
              >
                <Text style={styles.studentName}>{student.name}</Text>

                <Ionicons
                  name={student.attended ? "checkbox" : "square-outline"}
                  size={26}
                  color={student.attended ? "limegreen" : "#ccc"}
                />
              </TouchableOpacity>
            ))}

            {students.length === 0 && (
              <Text style={styles.empty}>No hay alumnos apuntados</Text>
            )}
          </ScrollView>
        )}

        {/* FOOTER */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? "Guardando..." : "Guardar asistencia"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
