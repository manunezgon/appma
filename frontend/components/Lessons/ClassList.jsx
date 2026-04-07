import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../../Styles/LessonStyles.jsx";

export default function ClassList({
  classes,
  refreshing,
  onRefresh,
  onEnroll,
  userRole,
  onDeleteClass,
  onTakeAttendance,
}) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    console.log("🔹 [ClassList] classes prop changed:", classes);
  }, [classes]);

  const confirmDelete = (item) => {
    console.log("🔹 [ClassList] confirm delete:", item);
    setSelectedClass(item);
    setConfirmVisible(true);
  };

  const handleDelete = () => {
    if (!selectedClass) return;
    console.log("🔹 [ClassList] deleting class:", selectedClass);
    onDeleteClass(selectedClass);
    setConfirmVisible(false);
    setSelectedClass(null);
  };

  const handleTakeAttendance = (item) => {
    console.log("🔹 [ClassList] onTakeAttendance clicked for:", item);
    onTakeAttendance(item);
  };

  return (
    <View style={styles.classContainer}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          console.log("🔹 [ClassList] rendering class item:", item);

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
                {userRole === "ADMIN" ? (
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => handleTakeAttendance(item)}
                    >
                      <Ionicons
                        name="clipboard-outline"
                        size={28}
                        color="#7c23b0ff"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => confirmDelete(item)}>
                      <Ionicons
                        name="trash-outline"
                        size={28}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  </View>
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
