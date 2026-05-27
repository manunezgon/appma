import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../Styles/LessonStyles.jsx";
import { colors } from "../../Styles/theme";
import ClassItem from "./ClassItem";

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

  const confirmDelete = useCallback((item) => {
    setSelectedClass(item);
    setConfirmVisible(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedClass) return;

    await onDeleteClass(selectedClass);

    setConfirmVisible(false);
    setSelectedClass(null);
  }, [onDeleteClass, selectedClass]);

  const closeConfirm = useCallback(() => {
    setConfirmVisible(false);
    setSelectedClass(null);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <ClassItem
        item={item}
        userRole={userRole}
        onEnroll={onEnroll}
        onDeleteClass={confirmDelete}
        onTakeAttendance={onTakeAttendance}
      />
    ),
    [confirmDelete, onEnroll, onTakeAttendance, userRole],
  );

  return (
    <View style={styles.classContainer}>
      <FlatList
        data={classes}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        removeClippedSubviews
        initialNumToRender={8}
        windowSize={7}
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
              {`Are you sure you want to delete the class "${selectedClass?.lessonName}"?`}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={closeConfirm}
              >
                <Ionicons name="close" size={28} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={28} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
