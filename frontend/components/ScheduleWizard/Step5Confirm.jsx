import { Text, TouchableOpacity } from "react-native";
import style from "../../Styles/ScheduleStyles.jsx";
import LessonSummary from "./LessonSummary.jsx";

export default function Step5Confirm({
  mode,
  selectedLessonObj,
  selectedDay,
  startTime,
  endTime,
  handleSaveSchedule,
}) {
  return (
    <>
      <Text style={style.subtitle}>
        {mode === "editSchedule" ? "Confirm Changes" : "Confirm Schedule"}
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
          {mode === "editSchedule" ? "Save Changes" : "Save Schedule"}
        </Text>
      </TouchableOpacity>
    </>
  );
}
