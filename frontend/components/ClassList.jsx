import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ClassList({ classes, refreshing, onRefresh, onEnroll }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Clases del día</Text>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const handleEnroll = () => onEnroll(item.id);

          return (
            <View style={styles.classCard}>
              <View>
                <Text style={styles.className}>{item.lessonName}</Text>
                <Text style={styles.professorName}>{item.professorName}</Text>
              </View>
              <View style={styles.rightContainer}>
                <Text style={styles.classTime}>{item.time}</Text>
                <TouchableOpacity
                  style={[styles.enrollButton, item.isEnrolled && styles.enrollButtonDisabled]}
                  disabled={item.isEnrolled}
                  onPress={handleEnroll}
                >
                  <Ionicons
                    name={item.isEnrolled ? "checkmark-circle" : "add"}
                    size={24}
                    color={item.isEnrolled ? "#28a745" : "#007AFF"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.noClasses}>No hay clases programadas.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  classCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightContainer: { flexDirection: "row", alignItems: "center" },
  className: { fontSize: 16, fontWeight: "600" },
  professorName: { fontSize: 14, color: "#555" },
  classTime: { fontSize: 14, color: "#555", marginRight: 10 },
  enrollButton: { padding: 5 },
  enrollButtonDisabled: { opacity: 0.5 },
  noClasses: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#999" },
});
