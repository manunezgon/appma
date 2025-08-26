import { View, StyleSheet } from "react-native";
import { useState } from "react";
import Calendar from "../../components/WeekCalendar";
import ClassList from "../../components/ClassList";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());

  const formatDate = (date) => date.toISOString().split("T")[0];

  const classesData = {
    "2025-08-25": [
      { id: "1", name: "Crossfit", time: "08:00 AM" },
      { id: "2", name: "Yoga", time: "10:00 AM" },
    ],
    "2025-08-28": [{ id: "3", name: "Spinning", time: "07:00 AM" }],
  };

  return (
    <View style={styles.container}>
      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <ClassList classes={classesData[formatDate(selectedDay)] || []} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
});
