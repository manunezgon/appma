import { Text, TouchableOpacity, View } from "react-native";
import style from "../../Styles/ScheduleStyles.jsx";

export default function Step1Mode({
  setMode,
  setLessonMode,
  setSelectedLessonId,
  setSelectedScheduleId,
  setStep,
}) {
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
        <Text style={style.buttonText}>Create new schedule</Text>
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
        <Text style={style.buttonText}>Edit existing schedule</Text>
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
        <Text style={style.buttonText}>Edit existing lesson</Text>
      </TouchableOpacity>
    </View>
  );
}
