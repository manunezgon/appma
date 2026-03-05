import { Text, TouchableOpacity } from "react-native";
import DayPicker from "./DayPicker.jsx";
import style from "./Styles.jsx";
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
      {/* --- Section Title --- */}
      <Text style={style.subtitle}>Select Day and Time</Text>

      {/* --- Day Picker --- */}
      <DayPicker
        days={daysOfWeek}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />

      {/* --- Start Time Input --- */}
      <Text style={style.subtitle2}>Start Time</Text>
      <TextInputField
        value={startTime}
        onChangeText={setStartTime}
        placeholder="e.g. 18:00"
        style={style.inputField}
      />

      {/* --- End Time Input --- */}
      <Text style={style.subtitle2}>End Time</Text>
      <TextInputField
        value={endTime}
        onChangeText={setEndTime}
        placeholder="e.g. 19:00"
        style={style.inputField}
      />

      {/* --- Next Button --- */}
      <TouchableOpacity
        style={[style.button, { marginTop: 10 }]}
        onPress={() => setStep(5)}
      >
        <Text style={style.buttonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
}
