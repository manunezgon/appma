import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useTranslation } from "../../hooks/useTranslation";
import { createLessonStyles } from "../../Styles/LessonStyles.jsx";
import { useTheme } from "../../context/ThemeContext";

export default function AttendanceModal({
  visible,
  onClose,
  selectedClass,
  selectedDay,
  students,
  loading,
  saving,
  onToggle,
  onSave,
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createLessonStyles(colors);

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.title}>{selectedClass?.lessonName}</Text>
          <Ionicons
            name="close"
            size={26}
            color={colors.text}
            onPress={onClose}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <ScrollView style={styles.list}>
            {(students ?? []).map((student) => (
              <TouchableOpacity
                key={student.id}
                style={styles.row}
                onPress={() => onToggle(student.id)}
              >
                <Text style={styles.studentName}>{student.name}</Text>

                <Ionicons
                  name={student.attended ? "checkbox" : "square-outline"}
                  size={26}
                  color={student.attended ? colors.success : colors.textMuted}
                />
              </TouchableOpacity>
            ))}

            {(students ?? []).length === 0 && (
              <Text style={styles.empty}>{t("attendance.noStudents")}</Text>
            )}
          </ScrollView>
        )}

        {/* FOOTER */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={onSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? t("attendance.saving") : t("attendance.save")}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
