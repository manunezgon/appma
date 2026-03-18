import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, View, Button, TouchableOpacity, Text } from "react-native";
import ClassList from "../../components/ClassList";
import Calendar from "../../components/WeekCalendar";
import ClassModal from "../../components/ClassModal";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../config";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [lessonsList, setLessonsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { user } = useUser();

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

  const fetchClasses = async () => {
    try {
      const dateStr = selectedDay.toISOString().split("T")[0];
      const res = await fetch(`${API_BASE_URL}/scheduleTemplates/day?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Data is not an array");

      const mapped = data.map(mapClassData).sort((a, b) => a.startMinutes - b.startMinutes);
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
    }, [selectedDay, user])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
  };

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
          cls.id === scheduleTemplateId ? { ...cls, isEnrolled: true } : cls
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onEditClass = (cls) => {
    setModalData(cls);
    setModalVisible(true);
  };

  const onDeleteClass = async (cls) => {
    try {
      const dateStr = selectedDay.toISOString().split("T")[0];
      await fetch(`${API_BASE_URL}/scheduleExceptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`},
        body: JSON.stringify({
        date: dateStr,
        startTime: cls.startTime,
        endTime: cls.endTime,  
        lessonId: cls.lessonId,
        cancelled: true,
      })
      });

      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalSubmit = async ({ dayOfWeek, startTime, endTime, lessonId }) => {
    try {
      const method = modalData.id ? "PUT" : "POST";
      const url = modalData.id
        ? `${API_BASE_URL}/scheduleTemplates/${modalData.id}`
        : `${API_BASE_URL}/scheduleTemplates`;

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ dayOfWeek, startTime, endTime, lessonId }),
      });
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <ClassList
        classes={classes}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEnroll={handleEnroll}
        userRole={user?.role}
        onEditClass={onEditClass}
        onDeleteClass={onDeleteClass}
      />

      <ClassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        initialData={modalData}
        lessons={lessonsList}
      />
      
      <Modal
        isVisible={errorModalVisible}
        onBackdropPress={() => setErrorModalVisible(false)}
      >
        <View style={styles.errorModal}>
           <View style={styles.modalHeader}>
          <Text style={styles.Title}>{errorMessage}</Text>
          <Ionicons name="close" size={28} style={styles.closenonpaidIcon} onPress={() => setErrorModalVisible(false)} />
            </View>
           <View style={styles.modalContent}>
            <Text style={styles.Content}> Por favor, paga el mes correspondiente para acceder a esta clase.</Text>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", paddingTop: 50 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",},
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
  },  closenonpaidIcon: {
    color: "purple",
  },
  modalContent: {
    color: "purple",
  }
});
