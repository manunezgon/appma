import { StyleSheet, Text, View } from "react-native";

export default function LessonSummary({
  lesson,
  day,
  startTime,
  endTime,
  showAmount = true,
}) {
  if (!lesson) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>Lesson: {lesson.lessonName}</Text>
      <Text style={styles.boldText}>Teacher: {lesson.professorName}</Text>
      {showAmount && lesson.amountMonthly != null && (
        <Text style={styles.boldText}>
          Monthly Price: ${lesson.amountMonthly.toFixed(2)}
        </Text>
      )}
      <Text>Day: {day}</Text>
      <Text>Start Time: {startTime}</Text>
      <Text>End Time: {endTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 5 },
  boldText: { fontWeight: "bold" },
});
