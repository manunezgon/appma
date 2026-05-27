import { Text, TouchableOpacity } from "react-native";
import style from "../../Styles/ScheduleStyles.jsx";

export default function DayPicker({ days, selectedDay, onSelect }) {
  return (
    <>
      {days.map((day) => {
        const isSelected = selectedDay === day.value;
        return (
          <TouchableOpacity
            key={day.value}
            style={[style.button, isSelected && style.selectedItem]}
            onPress={() => onSelect(day.value)}
          >
            <Text style={style.buttonText}>{day.label}</Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
}
