import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../../Styles/LessonStyles.jsx";
import defaultProfileImg from "../../app/assets/images/white_logo_circle.png";

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

  const handleTakeAttendance = (item) => {
    onTakeAttendance(item);
  };

  return (
    <View style={styles.classContainer}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <View style={styles.classCard}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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
              {item.students?.length > 0 && (
                <View style={styles.studentRow}>
                  {item.students.map((s) => (
                    <Image
                      key={s.id}
                      source={s.profileImageUrl ? { uri: s.profileImageUrl } : defaultProfileImg}
                      style={styles.studentAvatar}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.noClasses}>No classes scheduled.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete the class "
              {selectedClass?.lessonName}"?
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
