import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const StudentCard = ({ student, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(student)}>
      <View style={styles.infoContainer}>
        <Image
          source={
            student.profileImageUrl
              ? { uri: student.profileImageUrl }
              : require("../../app/assets/images/white_logo_circle.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{student.name}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={28} color="#888" />
    </TouchableOpacity>
  );
};

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
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#555",
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
