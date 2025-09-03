import { View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import Calendar from "../../components/WeekCalendar";
import ClassList from "../../components/ClassList";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);

  const getDayOfWeek = (date) => {
    const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    return days[date.getDay()];
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://192.168.1.86:8080/scheduleTemplates");
        const data = await response.json();

        const dayOfWeek = getDayOfWeek(selectedDay);

        const filtered = data.filter(item => item.dayOfWeek === dayOfWeek);

        const mapped = filtered.map(item => ({
          id: item.id.toString(),
          lessonName: item.lessonName,
          professorName: item.professorName,
          time: `${item.startTime.slice(0,5)} - ${item.endTime.slice(0,5)}`
        }));

        mapped.sort((a, b) => {
          const [hourA, minuteA] = a.time.split(' - ')[0].split(':').map(Number);
          const [hourB, minuteB] = b.time.split(' - ')[0].split(':').map(Number);

          if (hourA !== hourB) return hourA - hourB;
          return minuteA - minuteB;
        });


        setClasses(mapped);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [selectedDay]);

  return (
    <View style={styles.container}>
      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <ClassList classes={classes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
});
