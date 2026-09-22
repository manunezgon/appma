import { Text, TouchableOpacity } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { createScheduleStyles } from "../../Styles/ScheduleStyles.jsx";
import { useTheme } from "../../context/ThemeContext";
import LessonSummary from "./LessonSummary.jsx";

export default function Step5Confirm({
  mode,
  selectedLessonObj,
  selectedDay,
  startTime,
  endTime,
  handleSaveSchedule,
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const style = createScheduleStyles(colors);

  return (
    <>
      <Text style={style.subtitle}>
        {mode === "editSchedule"
          ? t("scheduleManagement.confirmChanges")
          : t("scheduleManagement.confirmSchedule")}
      </Text>

      <LessonSummary
        lesson={selectedLessonObj}
        day={selectedDay}
        startTime={startTime}
        endTime={endTime}
      />

      <TouchableOpacity
        style={[style.button, { marginTop: 10 }]}
        onPress={handleSaveSchedule}
      >
        <Text style={style.buttonText}>
          {mode === "editSchedule"
            ? t("scheduleManagement.saveChanges")
            : t("scheduleManagement.saveSchedule")}
        </Text>
      </TouchableOpacity>
    </>
  );
}
