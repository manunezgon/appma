import RNPickerSelect from "react-native-picker-select";
import { Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import styles from "../../Styles/LessonStyles.jsx";
import { colors } from "../../Styles/theme";


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
  return (

    <Modal isVisible={visible} onBackdropPress={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.adminModal}>
        <Text style={styles.titleCenter}>Create Class</Text>

        {/* Selección modo */}
        {!createMode && (
          <>
            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => setCreateMode("new")}
            >
              <Text style={styles.modeButtonText}>Create new lesson</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => setCreateMode("existing")}
            >
              <Text style={styles.modeButtonText}>Use existing lesson</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Crear nueva lesson */}
        {createMode === "new" && (
          <>
            <TextInput
              placeholder="Description"
              placeholderTextColor={colors.textSubtle}
              value={newDescription}
              onChangeText={setNewDescription}
              style={styles.input}
            />

            <TextInput
              placeholder="Start time (HH:MM)"
              placeholderTextColor={colors.textSubtle}
              value={newStartTime}
              onChangeText={setNewStartTime}
              style={styles.input}
            />

            <TextInput
              placeholder="End time (HH:MM)"
              placeholderTextColor={colors.textSubtle}
              value={newEndTime}
              onChangeText={setNewEndTime}
              style={styles.input}
            />

            <TouchableOpacity style={styles.saveButton} onPress={onCreateNew}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Usar lesson existente */}
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
                label: "Select a class",
                value: null,
                color: colors.textSubtle,
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.text}
                />
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
              placeholder="Hora inicio (HH:MM)"
              placeholderTextColor={colors.textSubtle}
              value={newStartTime}
              onChangeText={setNewStartTime}
              style={styles.input}
            />

            <TextInput
              placeholder="Hora fin (HH:MM)"
              placeholderTextColor={colors.textSubtle}
              value={newEndTime}
              onChangeText={setNewEndTime}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={onCreateExisting}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
