import { useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ClassList({
  classes,
  refreshing,
  onRefresh,
  onEnroll,
  userRole,
  onDeleteClass,
}) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const confirmDelete = (item) => {
    setSelectedClass(item);
    setConfirmVisible(true);
  };

  const handleDelete = () => {
    if (!selectedClass) return;
    onDeleteClass(selectedClass);
    setConfirmVisible(false);
    setSelectedClass(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const handleEnrollPress = () => onEnroll(item.id, item.isException);

          return (
            <View style={styles.classCard}>
              <View style={styles.leftContainer}>
                <Text style={styles.className}>{item.lessonName}</Text>
                <Text style={styles.professorName}>{item.professorName}</Text>
              </View>

              <View style={styles.centerContainer}>
                <Text style={styles.classTime}>{item.time}</Text>
              </View>

              {/* 🔹 Zona derecha combinada */}
              <View style={styles.rightContainer}>
                {userRole === "ADMIN" ? (
                  <TouchableOpacity onPress={() => confirmDelete(item)}>
                    <Ionicons name="trash-outline" size={30} color="#FF3B30" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.enrollButton,
                      item.isEnrolled && styles.enrollButtonDisabled,
                    ]}
                    disabled={item.isEnrolled || item.isPast}
                    onPress={() => onEnroll(item.id, item.isException)}
                  >
                    <Ionicons
                      name={
                        item.isEnrolled
                          ? "checkmark-circle"
                          : item.isPast
                            ? "time-outline"
                            : "add-circle"
                      }
                      size={30}
                      color={
                        item.isEnrolled
                          ? "#00923aff"
                          : item.isPast
                            ? "#555555"
                            : "#7c23b0ff"
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.noClasses}>No hay clases programadas.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              ¿Eliminar la clase "{selectedClass?.lessonName}"?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setConfirmVisible(false);
                  setSelectedClass(null);
                }}
              >
                <Ionicons name="close" size={28} color="#7c23b0ff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={28} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  classCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#CCCCCC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flex: 1,
  },
  centerContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  adminButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    paddingHorizontal: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555555",
  },
  professorName: {
    fontSize: 14,
    color: "#555555",
  },
  classTime: {
    fontSize: 14,
    color: "#555555",
    marginRight: 10,
  },
  enrollButton: {
    padding: 5,
  },
  enrollButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#CCCCCC",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },

  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noClasses: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#F5F5F5",
  },
});
