import { Text, TouchableOpacity } from "react-native";
import { createScheduleStyles } from "../../Styles/ScheduleStyles.jsx";
import { useTheme } from "../../context/ThemeContext";

export default function DayPicker({ days, selectedDay, onSelect }) {
  const { colors } = useTheme();
  const style = createScheduleStyles(colors);
  
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
