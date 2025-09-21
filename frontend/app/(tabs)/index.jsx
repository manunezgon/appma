import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import ClassList from "../../components/ClassList";
import Calendar from "../../components/WeekCalendar";
import { useUser } from "../../context/usercontext";
import { API_BASE_URL } from "../config"

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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


  useFocusEffect(useCallback(() => { fetchClasses(); }, [selectedDay]));

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
        body: JSON.stringify({
          scheduleTemplateId,
          date: dateStr, 
        }),
      });

      if (!response.ok) throw new Error("Error enrolling");

      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === scheduleTemplateId ? { ...cls, isEnrolled: true } : cls
        )
      );
    } catch (error) {
      console.error(error);
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", paddingTop: 50 },
});
