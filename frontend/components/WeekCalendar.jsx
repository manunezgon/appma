import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { useRef, useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function WeekCalendar({ selectedDay, setSelectedDay }) {
  const daysShort = ["L", "M", "X", "J", "V", "S", "D"];
  const flatListRef = useRef(null);

  const today = new Date();

  // Genera una semana (lun–dom) a partir de un offset
  const generateWeek = (weekOffset = 0) => {
    const currentDay = today.getDay(); 
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((currentDay + 6) % 7) + weekOffset * 7);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Rango de semanas
  const weeks = [];
  for (let i = -10; i <= 20; i++) weeks.push(generateWeek(i));

  // Semana visible
  const [currentWeekIndex, setCurrentWeekIndex] = useState(10);

  const formatDate = (date) => date.toISOString().split("T")[0];

  // El título siempre es el mes/año del día seleccionado
  const currentMonthName = selectedDay.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const goToToday = () => {
    setSelectedDay(today);
    setCurrentWeekIndex(10);
    flatListRef.current?.scrollToIndex({ index: 10, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con mes/año y botón Hoy */}
      <View style={styles.header}>
        <Text style={styles.monthTitle}>{currentMonthName}</Text>
        <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
          <Text style={styles.todayText}>Hoy</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList de semanas */}
      <FlatList
        ref={flatListRef}
        data={weeks}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialScrollIndex={10}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentWeekIndex(index);
        }}
        renderItem={({ item: week }) => (
          <View style={[styles.weekContainer, { width: SCREEN_WIDTH }]}>
            {week.map((day, index) => {
              const isSelected = formatDate(day) === formatDate(selectedDay);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayBox, isSelected && styles.selectedBox]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[styles.dayText, isSelected && styles.activeText]}>
                    {daysShort[index]}
                  </Text>
                  <Text style={[styles.dateText, isSelected && styles.activeText]}>
                    {day.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  monthTitle: { fontSize: 18, fontWeight: "bold" },
  todayButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  todayText: { color: "#fff", fontWeight: "600" },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  dayBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    width: 45,
  },
  selectedBox: { backgroundColor: "#007AFF" },
  dayText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  dateText: { fontSize: 16, color: "#333" },
  activeText: { color: "#fff" },
});
