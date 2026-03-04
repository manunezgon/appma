import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function DayPicker({ days, selectedDay, onSelect }) {
  return (
    <>
      {days.map((day) => {
        const isSelected = selectedDay === day.value;
        return (
          <TouchableOpacity
            key={day.value}
            style={[styles.button, isSelected && styles.selectedButton]}
            onPress={() => onSelect(day.value)}
          >
            <Text style={styles.buttonText}>{day.label}</Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#1976D2",
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
