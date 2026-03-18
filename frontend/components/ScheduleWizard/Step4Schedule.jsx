import { Text, TouchableOpacity } from "react-native";
import style from "../../Styles/ScheduleStyles.jsx";
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
  return (
    <>
      <Text style={style.subtitle}>Select Day and Time</Text>

      <DayPicker
        days={daysOfWeek}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />

      <Text style={style.subtitle2}>Start Time</Text>
      <TextInputField
        value={startTime}
        onChangeText={setStartTime}
        placeholder="e.g. 18:00"
        style={style.inputField}
      />

      <Text style={style.subtitle2}>End Time</Text>
      <TextInputField
        value={endTime}
        onChangeText={setEndTime}
        placeholder="e.g. 19:00"
        style={style.inputField}
      />

      <TouchableOpacity
        style={[style.button, { marginTop: 10 }]}
        onPress={() => setStep(5)}
      >
        <Text style={style.buttonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
}
