import { Text } from "react-native";

export default function LessonSummary({
  lesson,
  day,
  startTime,
  endTime,
  showAmount = true,
}) {
  return (
    <>
      <Text style={{ fontWeight: "bold" }}>Lesson: {lesson?.lessonName}</Text>
      <Text style={{ fontWeight: "bold" }}>
        Profesor: {lesson?.professorName}
      </Text>
      {showAmount && lesson?.amountMonthly && (
        <Text style={{ fontWeight: "bold" }}>
          Precio mensual: ${lesson.amountMonthly}
        </Text>
      )}
      <Text>Día: {day}</Text>
      <Text>Hora inicio: {startTime}</Text>
      <Text>Hora fin: {endTime}</Text>
    </>
  );
}
