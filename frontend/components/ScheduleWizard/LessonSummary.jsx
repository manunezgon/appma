import { Text, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import style from "../../Styles/ScheduleStyles.jsx";

export default function LessonSummary({
  lesson,
  day,
  startTime,
  endTime,
  showAmount = true,
}) {
  const { t } = useTranslation();
  if (!lesson) return null;

  return (
    <View style={style.summary}>
      <Text style={style.summaryText}>
        {t("scheduleManagement.lesson")}: {lesson.lessonName}
      </Text>
      <Text style={style.summaryText}>
        {t("scheduleManagement.teacher")}: {lesson.professorName}
      </Text>
      {showAmount && lesson.amountMonthly != null && (
        <Text style={style.summaryText}>
          {t("scheduleManagement.monthlyPrice")}:{" "}
          {lesson.amountMonthly.toFixed(2)} €
        </Text>
      )}
      <Text style={style.summaryText}>
        {t("scheduleManagement.day")}:{" "}
        {day ? t(`scheduleManagement.days.${day}`) : ""}
      </Text>
      <Text style={style.summaryText}>
        {t("scheduleManagement.startTime")}: {startTime}
      </Text>
      <Text style={style.summaryText}>
        {t("scheduleManagement.endTime")}: {endTime}
      </Text>
    </View>
  );
}
