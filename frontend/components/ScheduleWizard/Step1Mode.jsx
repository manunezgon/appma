import { Text, TouchableOpacity } from "react-native";
import style from "./Styles.jsx";

// Step 1: Choose the wizard mode
export default function Step1Mode({
  setMode,
  setLessonMode,
  setSelectedLessonId,
  setSelectedScheduleId,
  setStep,
}) {
  return (
    <>
      {/* Title / Question */}
      <Text style={style.subtitle}>Lesson & Schedule Management</Text>

      {/* Option 1: Create a new schedule */}
      <TouchableOpacity
        style={style.button}
        onPress={() => {
          setMode("create"); // Set wizard mode to 'create'
          setLessonMode(null); // No lesson mode yet
          setSelectedLessonId(null); // Clear selected lesson
          setSelectedScheduleId(null); // Clear selected schedule
          setStep(2); // Go to next step
        }}
      >
        <Text style={style.buttonText}>Create new schedule</Text>
      </TouchableOpacity>

      {/* Option 2: Edit an existing schedule */}
      <TouchableOpacity
        style={style.button}
        onPress={() => {
          setMode("editSchedule"); // Set wizard mode to 'editSchedule'
          setLessonMode("existing"); // We will select existing lesson
          setSelectedLessonId(null);
          setSelectedScheduleId(null);
          setStep(2);
        }}
      >
        <Text style={style.buttonText}>Edit existing schedule</Text>
      </TouchableOpacity>

      {/* Option 3: Edit an existing lesson */}
      <TouchableOpacity
        style={style.button}
        onPress={() => {
          setMode("editLesson"); // Set wizard mode to 'editLesson'
          setLessonMode("existing");
          setSelectedLessonId(null);
          setSelectedScheduleId(null);
          setStep(2);
        }}
      >
        <Text style={style.buttonText}>Edit existing lesson</Text>
      </TouchableOpacity>
    </>
  );
}
