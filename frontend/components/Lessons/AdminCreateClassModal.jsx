import RNPickerSelect from "react-native-picker-select";
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../../hooks/useTranslation";
import { createLessonStyles } from "../../Styles/LessonStyles.jsx";
import { useTheme } from "../../context/ThemeContext";


export default function AdminCreateClassModal({
  visible,
  onClose,

  createMode,
  setCreateMode,

  lessonsList,
  selectedLessonId,
  setSelectedLessonId,

  newStartTime,
  setNewStartTime,
  newEndTime,
  setNewEndTime,

  newDescription,
  setNewDescription,

  onCreateExisting,
  onCreateNew,
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createLessonStyles(colors);
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.adminModal}>
          <Text style={styles.titleCenter}>{t("createClass.title")}</Text>
          {!createMode && (
            <>
              <TouchableOpacity
                style={styles.modeButton}
                onPress={() => setCreateMode("new")}
              >
                <Text style={styles.modeButtonText}>
                  {t("createClass.createNewLesson")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modeButton}
                onPress={() => setCreateMode("existing")}
              >
                <Text style={styles.modeButtonText}>
                  {t("createClass.useExistingLesson")}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {createMode === "new" && (
            <>
              <TextInput
                placeholder={t("createClass.description")}
                placeholderTextColor={colors.textSubtle}
                value={newDescription}
                onChangeText={setNewDescription}
                style={styles.input}
              />

              <TextInput
                placeholder={t("createClass.startTime")}
                placeholderTextColor={colors.textSubtle}
                value={newStartTime}
                onChangeText={setNewStartTime}
                style={styles.input}
              />

              <TextInput
                placeholder={t("createClass.endTime")}
                placeholderTextColor={colors.textSubtle}
                value={newEndTime}
                onChangeText={setNewEndTime}
                style={styles.input}
              />

              <TouchableOpacity style={styles.saveButton} onPress={onCreateNew}>
                <Text style={styles.saveButtonText}>
                  {t("createClass.save")}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {createMode === "existing" && (
            <>
              <RNPickerSelect
                value={selectedLessonId}
                itemKey={selectedLessonId}
                onValueChange={setSelectedLessonId}
                items={lessonsList.map((lesson) => ({
                  label: `${lesson.lessonName} - ${lesson.professorName}`,
                  value: lesson.id,
                }))}
                placeholder={{
                  label: t("createClass.selectClass"),
                  value: null,
                  color: colors.textSubtle,
                }}
                useNativeAndroidPickerStyle={false}
                Icon={() => (
                  <Ionicons name="chevron-down" size={20} color={colors.text} />
                )}
                style={{
                  inputIOS: styles.picker,
                  inputAndroid: styles.picker,
                  placeholder: {
                    color: colors.textSubtle,
                  },
                  iconContainer: {
                    top: 14,
                    right: 12,
                  },
                }}
              />

              <TextInput
                placeholder={t("createClass.startTime")}
                placeholderTextColor={colors.textSubtle}
                value={newStartTime}
                onChangeText={setNewStartTime}
                style={styles.input}
              />

              <TextInput
                placeholder={t("createClass.endTime")}
                placeholderTextColor={colors.textSubtle}
                value={newEndTime}
                onChangeText={setNewEndTime}
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={onCreateExisting}
              >
                <Text style={styles.saveButtonText}>
                  {t("createClass.save")}
                </Text>
              </TouchableOpacity>
            </>
          )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
