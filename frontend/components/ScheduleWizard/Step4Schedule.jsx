import { Text, TouchableOpacity } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { createScheduleStyles } from "../../Styles/ScheduleStyles.jsx";
import { useTheme } from "../../context/ThemeContext";
import DayPicker from "./DayPicker.jsx";
import TextInputField from "./TextInputField.jsx";

const daysOfWeek = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

export default function Step4Schedule({
  selectedDay,
  setSelectedDay,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  setStep,
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const style = createScheduleStyles(colors);

  const translatedDays = daysOfWeek.map((day) => ({
    ...day,
    label: t(`scheduleManagement.days.${day.value}`),
  }));

  return (
    <>
      <Text style={style.subtitle}>
        {t("scheduleManagement.selectDayAndTime")}
      </Text>

      <DayPicker
        days={translatedDays}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />

      <Text style={style.subtitle2}>{t("scheduleManagement.startTime")}</Text>
      <TextInputField
        value={startTime}
        onChangeText={setStartTime}
        placeholder={t("scheduleManagement.startTimePlaceholder")}
        placeholderTextColor={colors.textOnLight}
        style={style.inputField}
      />

      <Text style={style.subtitle2}>{t("scheduleManagement.endTime")}</Text>
      <TextInputField
        value={endTime}
        onChangeText={setEndTime}
        placeholder={t("scheduleManagement.endTimePlaceholder")}
        placeholderTextColor={colors.textOnLight}
        style={style.inputField}
      />

      <TouchableOpacity
        style={[style.button, { marginTop: 10 }]}
        onPress={() => setStep(5)}
      >
        <Text style={style.buttonText}>{t("scheduleManagement.next")}</Text>
      </TouchableOpacity>
    </>
  );
}
