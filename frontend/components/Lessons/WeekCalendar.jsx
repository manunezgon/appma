import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function WeekCalendar({ selectedDay, setSelectedDay }) {
  const daysShort = ["M", "T", "W", "T", "F", "S", "S"];
  const flatListRef = useRef(null);

  const today = new Date();

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

  const weeks = [];
  for (let i = -10; i <= 20; i++) weeks.push(generateWeek(i));

  const [currentWeekIndex, setCurrentWeekIndex] = useState(10);

  const [currentMonthName, setCurrentMonthName] = useState(
    weeks[currentWeekIndex][0]
      .toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
      .replace(" ", " · "),
  );

  const formatDate = (date) => date.toISOString().split("T")[0];

  const goToToday = () => {
    setSelectedDay(today);
    setCurrentWeekIndex(10);
    flatListRef.current?.scrollToIndex({ index: 10, animated: true });
    setCurrentMonthName(
      today.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    );
  };

  const handleMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentWeekIndex(index);

    const firstDayOfWeek = weeks[index][0];
    const newMonthName = firstDayOfWeek.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    setCurrentMonthName(newMonthName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthTitle}>{currentMonthName}</Text>
        <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
          <Text style={styles.todayText}>Today</Text>
        </TouchableOpacity>
      </View>

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
        onMomentumScrollEnd={handleMomentumScrollEnd}
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
                  <Text
                    style={[styles.dayText, isSelected && styles.activeText]}
                  >
                    {daysShort[index]}
                  </Text>
                  <Text
                    style={[styles.dateText, isSelected && styles.activeText]}
                  >
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
  container: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
  },
  todayButton: {
    backgroundColor: "#7c23b0ff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  todayText: {
    color: "#CCCCCC",
    fontWeight: "600",
  },
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
    backgroundColor: "#555555",
    width: 45,
  },
  selectedBox: {
    backgroundColor: "#7c23b0ff",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0A0A0A",
  },
  dateText: {
    fontSize: 16,
    color: "#CCCCCC",
  },
  activeText: {
    color: "#CCCCCC",
  },
});
