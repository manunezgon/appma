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

  const fetchClasses = async () => {
    try {
      const dateStr = selectedDay.toISOString().split("T")[0];
      const response = await fetch(
        `${API_BASE_URL}/scheduleTemplates/day?date=${dateStr}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        setClasses([]);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        setClasses([]);
        return;
      }

      const mapped = data.map((item) => ({
        id: item.id.toString(),
        lessonName: item.lessonName,
        professorName: item.professorName,
        time: `${item.startTime.slice(0, 5)} - ${item.endTime.slice(0, 5)}`,
        isEnrolled: item.isEnrolled, 
      }));

      mapped.sort((a, b) => {
        const [hA, mA] = a.time.split(" - ")[0].split(":").map(Number);
        const [hB, mB] = b.time.split(" - ")[0].split(":").map(Number);
        return hA !== hB ? hA - hB : mA - mB;
      });

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
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
});
