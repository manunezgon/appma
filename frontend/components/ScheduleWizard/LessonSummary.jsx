import { Text, View } from "react-native";
import style from "../../Styles/ScheduleStyles.jsx";

export default function LessonSummary({
  lesson,
  day,
  startTime,
  endTime,
  showAmount = true,
}) {
  if (!lesson) return null;

  return (
    <View style={style.summary}>
      <Text style={style.summaryText}>Lesson: {lesson.lessonName}</Text>
      <Text style={style.summaryText}>Teacher: {lesson.professorName}</Text>
      {showAmount && lesson.amountMonthly != null && (
        <Text style={style.summaryText}>
          Monthly Price: {lesson.amountMonthly.toFixed(2)} €
        </Text>
      )}
      <Text style={style.summaryText}>Day: {day}</Text>
      <Text style={style.summaryText}>Start Time: {startTime}</Text>
      <Text style={style.summaryText}>End Time: {endTime}</Text>
    </View>
  );
}
