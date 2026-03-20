import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Modal from "react-native-modal";
import { API_BASE_URL } from "../app/config";
import { useUser } from "../context/UserContext";

export default function AttendanceModal({
  visible,
  onClose,
  classData,
  selectedDay,
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

      const res = await fetch(
        `${API_BASE_URL}/enrollments/class?scheduleTemplateId=${classData.id}&date=${dateStr}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );

      const data = await res.json();

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

      await fetch(`${API_BASE_URL}/enrollments/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          scheduleTemplateId: classData.id,
          date: dateStr,
          presentUserIds,
        }),
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
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
                <Text style={styles.name}>{student.name}</Text>

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 16,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  name: {
    color: "#fff",
    fontSize: 16,
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  saveBtn: {
    marginTop: 12,
    backgroundColor: "purple",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
