import { Picker } from "@react-native-picker/picker";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import styles from "../../Styles/LessonStyles.jsx";

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
      <View style={styles.adminModal}>
        <Text style={styles.titleCenter}>Crear Clase</Text>

        {/* Selección modo */}
        {!createMode && (
          <>
            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => setCreateMode("new")}
            >
              <Text style={styles.modeButtonText}>Crear nueva clase</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => setCreateMode("existing")}
            >
              <Text style={styles.modeButtonText}>Usar clase existente</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Crear nueva lesson */}
        {createMode === "new" && (
          <>
            <TextInput
              placeholder="Descripción"
              placeholderTextColor="#888"
              value={newDescription}
              onChangeText={setNewDescription}
              style={styles.input}
            />

            <TextInput
              placeholder="Hora inicio (HH:MM)"
              placeholderTextColor="#888"
              value={newStartTime}
              onChangeText={setNewStartTime}
              style={styles.input}
            />

            <TextInput
              placeholder="Hora fin (HH:MM)"
              placeholderTextColor="#888"
              value={newEndTime}
              onChangeText={setNewEndTime}
              style={styles.input}
            />

            <TouchableOpacity style={styles.saveButton} onPress={onCreateNew}>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Guardar
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Usar lesson existente */}
        {createMode === "existing" && (
          <>
            <Picker
              selectedValue={selectedLessonId}
              onValueChange={(value) => setSelectedLessonId(value)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona una clase" value={null} />

              {lessonsList.map((lesson) => (
                <Picker.Item
                  key={lesson.id}
                  label={`${lesson.lessonName} - ${lesson.professorName}`}
                  value={lesson.id}
                />
              ))}
            </Picker>

            <TextInput
              placeholder="Hora inicio (HH:MM)"
              placeholderTextColor="#888"
              value={newStartTime}
              onChangeText={setNewStartTime}
              style={styles.input}
            />

            <TextInput
              placeholder="Hora fin (HH:MM)"
              placeholderTextColor="#888"
              value={newEndTime}
              onChangeText={setNewEndTime}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={onCreateExisting}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Guardar
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
}
