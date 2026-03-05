import { Text, TouchableOpacity } from "react-native";
import LessonSummary from "./LessonSummary.jsx";
import style from "./Styles.jsx";

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
      {/* --- Step Title --- */}
      <Text style={style.subtitle}>
        {mode === "editSchedule" ? "Confirm Changes" : "Confirm Schedule"}
      </Text>

      {/* --- Lesson & Schedule Summary --- */}
      <LessonSummary
        lesson={selectedLessonObj}
        day={selectedDay}
        startTime={startTime}
        endTime={endTime}
      />

      {/* --- Save Button --- */}
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
