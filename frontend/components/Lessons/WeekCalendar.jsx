import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./Styles.jsx";

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
    <View style={styles.calendarContainer}>
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
