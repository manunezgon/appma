import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ClassList({ classes, refreshing, onRefresh, onEnroll, userRole, onEditClass, onDeleteClass }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const handleEnroll = () => onEnroll(item.id);

          return (
          <View style={styles.classCard}>
            <View style={styles.leftContainer}>
              <Text style={styles.className}>{item.lessonName}</Text>
              <Text style={styles.professorName}>{item.professorName}</Text>
            </View>

            <View style={styles.centerContainer}>
              <Text style={styles.classTime}>{item.time}</Text>
            </View>

            <View style={styles.rightContainer}>
              <TouchableOpacity
                style={[styles.enrollButton, item.isEnrolled && styles.enrollButtonDisabled]}
                disabled={item.isEnrolled || item.isPast}
                onPress={handleEnroll}
              >
                <Ionicons
                  name={
                    item.isEnrolled ? "checkmark-circle" 
                    : item.isPast ? "time-outline"
                    : "add-circle"
                  }
                  size={30}
                  color={
                    item.isEnrolled ? "#00923aff" 
                    : item.isPast ? "#555555"
                    : "#7c23b0ff"
                  }
                />
              </TouchableOpacity>
            </View>

            {userRole === "ADMIN" && (
              <View style={styles.adminButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => onDeleteClass(item)}>
                  <Text style={styles.editButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
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
  container: { 
    flex: 1, 
    paddingHorizontal: 15,
    paddingVertical: 10 
  },
  classCard: {
  padding: 15,
  marginBottom: 10,
  borderRadius: 10,
  backgroundColor: "#CCCCCC",
  flexDirection: "column", // columna principal
},
  leftContainer: {
    marginBottom: 5,
  },
  centerContainer: {
    marginBottom: 5,
  },
  rightContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  adminButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    backgroundColor: "#7c23b0ff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  className: { 
    fontSize: 16, 
    fontWeight: "600", 
    color:"#555555" 
  },
  professorName: { 
    fontSize: 14, 
    color: "#555555" 
  },
  classTime: { 
    fontSize: 14, 
    color: "#555555", 
    marginRight: 10 
  },
  enrollButton: { 
    padding: 5 
  },
  enrollButtonDisabled: {
    opacity: 0.5,
  },
  noClasses: { 
    textAlign: "center", 
    marginTop: 20, 
    fontSize: 16, 
    color: "#F5F5F5" 
  },
});
