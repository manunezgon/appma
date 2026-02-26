import { Text, TouchableOpacity } from "react-native";

export default function DayPicker({ days, selectedDay, onSelect }) {
  return (
    <>
      {days.map((day) => (
        <TouchableOpacity
          key={day.value}
          style={[
            {
              padding: 10,
              marginVertical: 4,
              borderRadius: 8,
              backgroundColor: "#1976D2",
            },
            selectedDay === day.value && { backgroundColor: "#4CAF50" },
          ]}
          onPress={() => onSelect(day.value)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>{day.label}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
}
