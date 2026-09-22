import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { createScheduleStyles } from "../../Styles/ScheduleStyles.jsx";
import { useTheme } from "../../context/ThemeContext";

export default function Step1Mode({
  setMode,
  setLessonMode,
  setSelectedLessonId,
  setSelectedScheduleId,
  setStep,
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const style = createScheduleStyles(colors);
  return (
    <View style={style.container}>
      <TouchableOpacity
        style={style.button}
        onPress={() => {
          setMode("create");
          setLessonMode(null);
          setSelectedLessonId(null);
          setSelectedScheduleId(null);
          setStep(2);
        }}
      >
        <Text style={style.buttonText}>
          {t("scheduleManagement.createNewSchedule")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={style.button}
        onPress={() => {
          setMode("editSchedule");
          setLessonMode("existing");
          setSelectedLessonId(null);
          setSelectedScheduleId(null);
          setStep(2);
        }}
      >
        <Text style={style.buttonText}>
          {t("scheduleManagement.editExistingSchedule")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={style.button}
        onPress={() => {
          setMode("editLesson");
          setLessonMode("existing");
          setSelectedLessonId(null);
          setSelectedScheduleId(null);
          setStep(2);
        }}
      >
        <Text style={style.buttonText}>
          {t("scheduleManagement.editExistingLesson")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
