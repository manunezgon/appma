import { View, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import Calendar from "../../components/WeekCalendar";
import ClassList from "../../components/ClassList";
import { useUser } from "../../context/usercontext";


export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();

  const fetchClasses = async () => {
    try {
      const dateStr = selectedDay.toISOString().split("T")[0];
      const response = await fetch(`http://192.168.1.91:8080/scheduleTemplates/day?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        setClasses([]);
        return;
      }

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } 
      catch { setClasses([]); return; }

      if (!Array.isArray(data)) { setClasses([]); return; }

      const mapped = data.map(item => ({
        id: item.id.toString(),
        lessonName: item.lessonName,
        professorName: item.professorName,
        time: `${item.startTime.slice(0,5)} - ${item.endTime.slice(0,5)}`
      }));

      mapped.sort((a, b) => {
        const [hA, mA] = a.time.split(' - ')[0].split(':').map(Number);
        const [hB, mB] = b.time.split(' - ')[0].split(':').map(Number);
        return hA !== hB ? hA - hB : mA - mB;
      });

      setClasses(mapped);

    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    }
  };

  useFocusEffect(
    useCallback(() => { fetchClasses(); }, [selectedDay])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <ClassList 
        classes={classes} 
        refreshing={refreshing} 
        onRefresh={onRefresh} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
});
