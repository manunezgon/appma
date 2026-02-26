import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const StudentCard = ({ student, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(student)}>
    <Text style={styles.name}>{student.name}</Text>
    <Ionicons name="chevron-forward-outline" size={28} color="#888" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});